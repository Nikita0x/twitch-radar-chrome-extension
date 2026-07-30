import { getStreamerNotifications, type UserSettings } from '@/services/storage.service';

export function formatUptime(startedAt: string) {
	const started = new Date(startedAt);
	const now = new Date();
	const diffMs = Math.max(0, now.getTime() - started.getTime());
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 0) {
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	}
	return `${minutes}m`;
}

export function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function extractTokenFromUrl(url: string) {
	try {
		const hash = new URL(url).hash.substring(1);
		const params = new URLSearchParams(hash);
		return params.get('access_token');
	} catch {
		return null;
	}
}

export function hasActiveNotifications(settings: UserSettings, streamerId: string) {
	const notifications = getStreamerNotifications(settings, streamerId);

	return (
		notifications.live.enabled ||
		notifications.titleChange.enabled ||
		notifications.categoryChange.enabled
	);
}
