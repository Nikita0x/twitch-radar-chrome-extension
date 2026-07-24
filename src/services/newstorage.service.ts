import type { StreamerId, IsEnabled } from '@/stores/user-settings.store';

interface StorageSchema {
	auth: AuthState;
	userSettings: UserSettings;
}

type Viewers = 'viewers:highToLow' | 'viewers:lowToHigh';
type StreamDuration = 'duration:longest' | 'duration:shortest';
type Sort = Viewers | StreamDuration;

interface AuthState {
	isAuthenticated: boolean;
	accessToken: string;
	userId: string;
}

interface StreamerNotifications {
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
	notifications: Record<StreamerId, StreamerNotifications>;
}

export const DEFAULT_STORAGE: StorageSchema = {
	auth: {
		accessToken: '',
		isAuthenticated: false,
		userId: '',
	},
	userSettings: {
		notifications: {},
		sort: 'viewers:highToLow',
		theme: 'light',
	},
};

export async function getStorage(): Promise<StorageSchema> {
	const result = await chrome.storage.local.get('storage');

	if (!result.storage) {
		const storage = structuredClone(DEFAULT_STORAGE);

		await chrome.storage.local.set({
			storage,
		});

		return storage;
	}

	return result.storage;
}

export async function saveStorage(storage: StorageSchema): Promise<void> {
	await chrome.storage.local.set({
		storage,
	});
}
