import type { StreamerId } from '@/stores/user-settings.store';
import type { FollowData } from '@/stores/twitch.store';
import { migrateLegacyStorage } from '@/services/storage.migration';

// auth/userSettings/runtime are stored under independent top-level keys in
// browser.storage.local (instead of one nested "storage" blob) so a write to
// one domain can never clobber a concurrent write to another — previously
// every save did read-whole-blob -> mutate one part -> write-whole-blob,
// which lost updates whenever two domains were saved close together (e.g.
// the background alarm persisting runtime.liveStreams while the popup saved
// userSettings), making the live streams list go blank until reopening.
export interface StorageSchema {
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

export interface RuntimeState {
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

export const DEFAULT_AUTH: AuthState = {
	accessToken: '',
	isAuthenticated: false,
	userId: '',
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
	notifications: {},
	sort: 'viewers:highToLow',
	theme: 'light',
	livePreviews: false,
};

export const DEFAULT_RUNTIME: RuntimeState = {
	previousStreams: {},
	liveStreams: [],
	previewTick: 0,
};

export const DEFAULT_STORAGE: StorageSchema = {
	auth: DEFAULT_AUTH,
	userSettings: DEFAULT_USER_SETTINGS,
	runtime: DEFAULT_RUNTIME,
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

// Firefox's storage.local uses structured clone and rejects Vue/Pinia reactive
// proxies outright; Chrome tolerates them. Strip reactivity by round-tripping
// through JSON — storage.local only ever holds plain JSON-safe data anyway.
function toPlain<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

let migrationDone: Promise<void> | null = null;

/**
 * One-time move from the old single "storage" blob key to the three
 * independent keys below. Idempotent and safe to run from multiple contexts
 * (popup + background) concurrently — worst case it re-splits the same
 * legacy blob twice and removes the old key twice, no data is lost either way.
 */
function ensureMigrated(): Promise<void> {
	if (!migrationDone) migrationDone = migrateLegacyKey();
	return migrationDone;
}

async function migrateLegacyKey(): Promise<void> {
	const result = (await browser.storage.local.get('storage')) as { storage?: unknown };

	if (!result.storage) return;

	const migrated = migrateLegacyStorage(result.storage);

	await browser.storage.local.set({
		auth: migrated.auth,
		userSettings: migrated.userSettings,
		runtime: migrated.runtime,
	});
	await browser.storage.local.remove('storage');
}

export async function getAuth(): Promise<AuthState> {
	await ensureMigrated();
	const result = (await browser.storage.local.get('auth')) as { auth?: AuthState };
	return result.auth ?? structuredClone(DEFAULT_AUTH);
}

export async function saveAuth(auth: AuthState): Promise<void> {
	await browser.storage.local.set({ auth: toPlain(auth) });
}

export async function getUserSettings(): Promise<UserSettings> {
	await ensureMigrated();
	const result = (await browser.storage.local.get('userSettings')) as {
		userSettings?: UserSettings;
	};
	return result.userSettings ?? structuredClone(DEFAULT_USER_SETTINGS);
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
	await browser.storage.local.set({ userSettings: toPlain(settings) });
}

export async function getRuntime(): Promise<RuntimeState> {
	await ensureMigrated();
	const result = (await browser.storage.local.get('runtime')) as { runtime?: RuntimeState };
	return result.runtime ?? structuredClone(DEFAULT_RUNTIME);
}

export async function saveRuntime(runtime: RuntimeState): Promise<void> {
	await browser.storage.local.set({ runtime: toPlain(runtime) });
}

/**
 * Convenience combined read of all three domains. Read-only by design — always
 * save through the targeted save*() functions above, never reassemble this
 * back into one object and write it, or the whole point of splitting the keys
 * is lost.
 */
export async function getStorage(): Promise<StorageSchema> {
	const [auth, userSettings, runtime] = await Promise.all([
		getAuth(),
		getUserSettings(),
		getRuntime(),
	]);

	return { auth, userSettings, runtime };
}
