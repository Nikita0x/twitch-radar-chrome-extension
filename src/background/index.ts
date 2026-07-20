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
			iconUrl: chrome.runtime.getURL('icon.png'),
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
});
