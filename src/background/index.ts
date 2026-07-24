import { ALARM_NAME } from '@/constants';
import {
	getStorage,
	getStreamerNotifications,
	saveStorage,
	type PreviousStream,
	type StreamerNotifications,
} from '@/services/storage.service';
import { fetchFollowedLiveStreams } from '@/services/twitch-api';
import type { FollowData } from '@/stores/twitch.store';

// Create a repeating alarm (every 30 seconds) when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 });
});

// Open the stream when the user clicks the "Open Stream" notification button.
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
	if (buttonIndex === 0) {
		chrome.tabs.create({ url: `https://twitch.tv/${notificationId}` });
	}
});

/* ── OAuth handler ── */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type !== 'OAUTH_LOGIN') return;

	handleOAuth(message.url, sendResponse);

	return true; // Keep the message channel open for async response.
});

async function handleOAuth(url: string, sendResponse: (response: unknown) => void) {
	try {
		console.log('[background] Starting launchWebAuthFlow...');

		const redirectUrl = await chrome.identity.launchWebAuthFlow({
			url,
			interactive: true,
		});

		if (!redirectUrl) {
			sendResponse({
				ok: false,
				error: 'Authorization was cancelled or not completed.',
			});
			return;
		}

		console.log('[background] OAuth completed:', redirectUrl);

		sendResponse({
			ok: true,
			redirectUrl,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);

		console.error('[background] OAuth error:', err);

		sendResponse({
			ok: false,
			error: message,
		});
	}
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name !== ALARM_NAME) return;

	const storage = await getStorage();

	if (!storage.auth.isAuthenticated) return;

	const liveStreamsResult = await fetchFollowedLiveStreams(
		storage.auth.accessToken,
		storage.auth.userId
	);

	if (!liveStreamsResult.ok) {
		console.error(liveStreamsResult.error);
		return;
	}

	const liveStreams = liveStreamsResult.data;

	if (liveStreams.length === 0) {
		await updateBadge(0);
		return;
	}

	await updateBadge(liveStreams.length);

	for (const streamer of liveStreams) {
		const previous = storage.runtime.previousStreams[streamer.user_id];
		const settings = getStreamerNotifications(storage.userSettings, streamer.user_id);

		await checkLiveNotification(streamer, previous, settings);
		await checkTitleNotification(streamer, previous, settings);
		// await checkCategoryNotification(streamer, previous, settings);

		storage.runtime.previousStreams[streamer.user_id] = {
			title: streamer.title,
			category: streamer.game_name,
		};
	}

	await saveStorage(storage);
});

async function sendNotification(stream: FollowData, title: string, message: string) {
	try {
		await chrome.notifications.create(stream.user_login, {
			type: 'basic',
			iconUrl: chrome.runtime.getURL('icon128.png'),
			title,
			message,
			priority: 2,
			buttons: [{ title: 'Open Stream' }],
		});
	} catch (err) {
		console.error('Failed to send notification for', stream.user_name, err);
	}
}

async function updateBadge(count: number) {
	if (count === 0) {
		await chrome.action.setBadgeText({ text: '0' });
		await chrome.action.setBadgeBackgroundColor({
			color: '#808080',
		});
		return;
	}

	await chrome.action.setBadgeText({ text: String(count) });
	await chrome.action.setBadgeBackgroundColor({ color: '#EB0400' });
	await chrome.action.setBadgeTextColor({ color: 'white' });
}

async function checkLiveNotification(
	stream: FollowData,
	previous: PreviousStream | undefined,
	settings: StreamerNotifications
) {
	// Live notifications are disabled.
	if (!settings.live.enabled) return;

	// Stream was already live during the previous check.
	if (previous) return;

	// Stream just went live.
	await sendNotification(stream, `${stream.user_name} is LIVE 🔴`, stream.title);

	if (settings.live.autoOpen) {
		await chrome.tabs.create({
			url: `https://twitch.tv/${stream.user_login}`,
		});
	}
}
async function checkTitleNotification(
	stream: FollowData,
	previous: PreviousStream | undefined,
	settings: StreamerNotifications
) {
	if (!settings.titleChange.enabled) return;

	// No previous snapshot -> stream just started.
	if (!previous) return;

	// Title didn't change.
	if (previous.title === stream.title) return;

	await sendNotification(stream, `${stream.user_name} changed stream title ✏️`, stream.title);

	if (settings.titleChange.autoOpen) {
		await chrome.tabs.create({
			url: `https://twitch.tv/${stream.user_login}`,
		});
	}
}

async function checkCategoryNotification(
	stream: FollowData,
	previous: PreviousStream | undefined,
	settings: StreamerNotifications
) {
	// Category change notifications are disabled.
	if (!settings.categoryChange.enabled) return;

	// No previous snapshot means the stream has just started.
	// This is handled by checkLiveNotification().
	if (!previous) return;

	// Category hasn't changed.
	if (previous.category === stream.game_name) return;

	// User only wants notifications for specific categories.
	if (!settings.categoryChange.categories.includes(stream.game_name)) return;

	await sendNotification(
		stream,
		`${stream.user_name} changed category 🎮`,
		`Now playing: ${stream.game_name}`
	);

	if (settings.categoryChange.autoOpen) {
		await chrome.tabs.create({
			url: `https://twitch.tv/${stream.user_login}`,
		});
	}
}
