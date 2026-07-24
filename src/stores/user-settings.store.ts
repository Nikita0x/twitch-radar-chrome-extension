import type { StreamerNotifications, UserSettings } from '@/services/storage.service';
import { DEFAULT_STORAGE, getStorage, saveStorage } from '@/services/storage.service';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type StreamerId = string;

export const useUserSettingsStore = defineStore('user-settings', () => {
	const userSettingsState = ref<UserSettings>({ ...DEFAULT_STORAGE.userSettings });

	async function loadSettings() {
		const storage = await getStorage();

		userSettingsState.value = storage.userSettings;
	}

	async function updateSettings(partialSettings: Partial<UserSettings>) {
		Object.assign(userSettingsState.value, partialSettings);

		const storage = await getStorage();

		storage.userSettings = userSettingsState.value;

		await saveStorage(storage);
	}

	async function updateStreamerNotifications(
		streamerId: StreamerId,
		streamerNotifications: StreamerNotifications
	) {
		userSettingsState.value.notifications[streamerId] = streamerNotifications;

		const storage = await getStorage();
		storage.userSettings = userSettingsState.value;

		await saveStorage(storage);
	}

	async function toggleTheme() {
		const newTheme = userSettingsState.value.theme === 'dark' ? 'light' : 'dark';
		await updateSettings({ theme: newTheme });
		applyTheme(newTheme);
	}

	function applyTheme(theme: 'light' | 'dark') {
		document.documentElement.setAttribute('data-theme', theme);
	}

	return {
		userSettingsState,
		updateSettings,
		loadSettings,
		updateStreamerNotifications,
		toggleTheme,
		applyTheme,
	};
});
