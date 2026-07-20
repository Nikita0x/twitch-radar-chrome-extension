interface StorageSchema {
	auth: AuthState
	userSettings: UserSettings
	streamerNotifications: Record<string, boolean>
	notifiedStreams: Record<string, string>
}

type Viewers = 'viewers:highToLow' | 'viewers:lowToHigh'
type StreamDuration = 'duration:longest' | 'duration:shortest'
type Sort = Viewers | StreamDuration

interface AuthState {
	isAuthenticated: boolean
	accessToken: string
	userId: string
}

export interface UserSettings {
	enableAllNotifications: boolean
	sort: Sort
	/**TODO: Not implemented yet */
	autoOpen: boolean
	/**TODO: Not implemented yet */
	theme: 'light' | 'dark'
}

export const DEFAULT_STORAGE: StorageSchema = {
	auth: {
		accessToken: '',
		isAuthenticated: false,
		userId: '',
	},
	userSettings: {
		autoOpen: false,
		enableAllNotifications: false,
		sort: 'viewers:highToLow',
		theme: 'light',
	},
	streamerNotifications: {},
	notifiedStreams: {},
}

export async function getStorage(): Promise<StorageSchema> {
	const result = await chrome.storage.local.get('storage')

	if (!result.storage) {
		const storage = structuredClone(DEFAULT_STORAGE)

		await chrome.storage.local.set({
			storage,
		})

		return storage
	}

	return result.storage
}

export async function saveStorage(storage: StorageSchema): Promise<void> {
	await chrome.storage.local.set({
		storage,
	})
}
