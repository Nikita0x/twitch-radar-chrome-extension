import type { StreamerId } from '@/stores/user-settings.store';
import type { FollowData } from '@/stores/twitch.store';
import { migrateStorage } from './storage.migration';

export interface StorageSchema {
	version: 2;

	auth: AuthState;
	userSettings: UserSettings;
	runtime: RuntimeState;
}

type Viewers = 'viewers:highToLow' | 'viewers:lowToHigh';
type StreamDuration = 'duration:longest' | 'duration:shortest';
export type Sort = Viewers | StreamDuration;

export interface AuthState {
	isAuthenticated: boolean;
	accessToken: string;
	userId: string;
}

interface RuntimeState {
	previousStreams: Record<StreamerId, PreviousStream>;
	liveStreams: FollowData[];
	previewTick: number;
}

export interface PreviousStream {
	title: string;
	category: string;
}

export interface StreamerNotifications {
	/** When streamer goes `live`.*/
	live: NotificationRule;
	/** When `title` of the stream changes. */
	titleChange: NotificationRule;
	/** When `category` of the stream changes. */
	categoryChange: CategoryChangeRule;
}

interface NotificationRule {
	enabled: boolean;
	/**Automatically open new browser tab. */
	autoOpen: boolean;
}

interface CategoryChangeRule extends NotificationRule {
	categories: string[];
}
export interface UserSettings {
	sort: Sort;
	theme: 'light' | 'dark';
	livePreviews: boolean;
	notifications: Record<StreamerId, StreamerNotifications>;
}

export const STORAGE_VERSION = 2 as const;
export const DEFAULT_STORAGE: StorageSchema = {
	version: STORAGE_VERSION,
	auth: {
		accessToken: '',
		isAuthenticated: false,
		userId: '',
	},
	userSettings: {
		notifications: {},
		sort: 'viewers:highToLow',
		theme: 'light',
		livePreviews: false,
	},
	runtime: { previousStreams: {}, liveStreams: [], previewTick: 0 },
};

export const DEFAULT_NOTIFICATION_SETTINGS: StreamerNotifications = {
	live: {
		enabled: false,
		autoOpen: false,
	},
	titleChange: {
		enabled: false,
		autoOpen: false,
	},
	categoryChange: {
		enabled: false,
		autoOpen: false,
		categories: [],
	},
};

export function getStreamerNotifications(
	settings: UserSettings,
	streamerId: StreamerId
): StreamerNotifications {
	return settings.notifications[streamerId] ?? structuredClone(DEFAULT_NOTIFICATION_SETTINGS);
}

export async function getStorage(): Promise<StorageSchema> {
	const result = (await browser.storage.local.get('storage')) as { storage?: StorageSchema };

	if (!result.storage) {
		const storage = structuredClone(DEFAULT_STORAGE);

		await browser.storage.local.set({
			storage,
		});

		return storage;
	}

	const storage = migrateStorage(result.storage);

	if (storage.version !== result.storage.version) {
		await saveStorage(storage);
	}

	return storage;
}

export async function saveStorage(storage: StorageSchema): Promise<void> {
	// Callers often pass Pinia/Vue reactive proxies (e.g. `userSettingsState.value`).
	// Firefox's storage.local uses structured clone and rejects those outright;
	// Chrome tolerates them. Strip reactivity by round-tripping through JSON —
	// storage.local only ever holds plain JSON-safe data anyway.
	await browser.storage.local.set({
		storage: JSON.parse(JSON.stringify(storage)),
	});
}
