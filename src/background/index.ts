import { getStorage, saveStorage } from '@/services/storage.service';
import { fetchFollowedStreams } from '@/services/twitch-api';

const ALARM_NAME = 'periodic-notification';

async function sendNotification(stream: {
	user_id: string;
	user_name: string;
	title: string;
	user_login: string;
}) {
	try {
		await chrome.notifications.create(stream.user_login, {
			type: 'basic',
			iconUrl: chrome.runtime.getURL('icon128.png'),
			title: `${stream.user_name} is LIVE 🔴`,
			message: stream.title,
			priority: 2,
			buttons: [{ title: 'Open Stream' }],
		});
	} catch (err) {
		console.error('Failed to send notification for', stream.user_name, err);
	}
}

chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 });
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
	if (buttonIndex === 0) {
		chrome.tabs.create({ url: `https://twitch.tv/${notificationId}` });
	}
});

/* ── OAuth handler ── */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === 'OAUTH_LOGIN') {
		const url = message.url as string;
		console.log('[background] Получен запрос OAuth');
		console.log('[background] === DIAGNOSTICS ===');
		console.log('[background] chrome.runtime.id:', chrome.runtime.id);
		console.log(
			'[background] chrome.runtime.getManifest().version:',
			chrome.runtime.getManifest().version
		);
		console.log(
			'[background] chrome.runtime.getManifest().permissions:',
			JSON.stringify(chrome.runtime.getManifest().permissions)
		);
		console.log('[background] Full auth URL:', url);
		// Extract and display the redirect_uri for verification
		try {
			const parsedUrl = new URL(url);
			const redirectUri = parsedUrl.searchParams.get('redirect_uri');
			console.log('[background] redirect_uri parameter:', redirectUri);
			console.log(
				'[background] Expected redirect_uri (chromiumapp.org):',
				`https://${chrome.runtime.id}.chromiumapp.org/`
			);
			console.log(
				'[background] Match:',
				redirectUri === `https://${chrome.runtime.id}.chromiumapp.org/`
			);
		} catch (e) {
			console.log('[background] Failed to parse auth URL:', e);
		}

		console.log('[background] Запускаю launchWebAuthFlow...');
		chrome.identity
			.launchWebAuthFlow({ url, interactive: true })
			.then((redirectUrl) => {
				if (!redirectUrl) {
					console.log('[background] OAuth: redirectUrl пустой');
					sendResponse({ ok: false, error: 'Авторизация была отменена или не завершилась' });
					return;
				}
				console.log('[background] OAuth завершён, redirect URL получен:', redirectUrl);
				sendResponse({ ok: true, redirectUrl });
			})
			.catch((err) => {
				const msg = err instanceof Error ? err.message : String(err);
				console.log('[background] OAuth ошибка:', msg);
				console.log('[background] Error stack:', err instanceof Error ? err.stack : 'N/A');
				sendResponse({ ok: false, error: msg });
			});
		return true; // keep channel open for async sendResponse
	}
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name !== ALARM_NAME) return;

	const storage = await getStorage();

	if (!storage.auth.isAuthenticated) return;

	const token = storage.auth.accessToken;
	const userId = storage.auth.userId;
	const liveStreams = await fetchFollowedStreams(token, userId);

	if (liveStreams.length === 0) {
		if (Object.keys(storage.notifiedStreams).length > 0) {
			storage.notifiedStreams = {};
			await saveStorage(storage);
		}
		await chrome.action.setBadgeText({ text: '0' });
		await chrome.action.setBadgeBackgroundColor({ color: '#808080' });
		return;
	}

	const notified = { ...storage.notifiedStreams };
	const notificationPromises: Promise<void>[] = [];
	let changed = false;

	// If this is the first check (no previously tracked streams),
	// just record current state without sending notifications.
	// This prevents spam on first login when many streamers are already live.
	const isFirstCheck = Object.keys(notified).length === 0;

	for (const stream of liveStreams) {
		const streamerNotifs = storage.streamerNotifications[stream.user_id] ?? false;
		const globalNotifs = storage.userSettings.enableAllNotifications;

		if (!globalNotifs && !streamerNotifs) continue;

		const prevNotified = notified[stream.user_id];

		if (prevNotified !== stream.title) {
			// Only send notification if this is not the first check
			if (!isFirstCheck) {
				notificationPromises.push(sendNotification(stream));
			}
			notified[stream.user_id] = stream.title;
			changed = true;
		}
	}

	await Promise.all(notificationPromises);

	const liveIds = new Set(liveStreams.map((s) => s.user_id));
	for (const id of Object.keys(notified)) {
		if (!liveIds.has(id)) {
			delete notified[id];
			changed = true;
		}
	}

	if (changed) {
		storage.notifiedStreams = notified;
		await saveStorage(storage);
	}

	// Update badge with total live stream count
	await chrome.action.setBadgeText({ text: String(liveStreams.length) });
	await chrome.action.setBadgeBackgroundColor({ color: '#EB0400' });
	await chrome.action.setBadgeTextColor({ color: 'white' });
});
