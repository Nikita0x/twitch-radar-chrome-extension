import { getStorage, saveStorage } from '@/services/storage.service';
import { fetchFollowedStreams } from '@/services/twitch-api';

const ALARM_NAME = 'periodic-notification';

async function sendNotification(stream: {
	user_id: string;
	user_name: string;
	title: string;
	thumbnail_url: string;
}) {
	const thumbnail = stream.thumbnail_url.replace('{width}', '200').replace('{height}', '100');

	await chrome.notifications.create(stream.user_id, {
		type: 'image',
		iconUrl: chrome.runtime.getURL('icon.png'),
		imageUrl: thumbnail,
		title: stream.user_name,
		message: stream.title,
		priority: 2,
	});
}

chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 });
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
	let changed = false;

	for (const stream of liveStreams) {
		const streamerNotifs = storage.streamerNotifications[stream.user_id] ?? false;
		const globalNotifs = storage.userSettings.enableAllNotifications;

		if (!globalNotifs && !streamerNotifs) continue;

		const prevNotified = notified[stream.user_id];

		if (prevNotified !== stream.title) {
			await sendNotification(stream);
			notified[stream.user_id] = stream.title;
			changed = true;
		}
	}

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
