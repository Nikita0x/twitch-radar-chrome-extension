import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { UserSettings } from '@/services/storage.service';
import { getStorage, saveStorage } from '@/services/storage.service';
import { DEFAULT_STORAGE } from '@/services/storage.service';

export const useUserSettings = defineStore('user-settings', () => {
	const userSettingsState = ref<UserSettings>({ ...DEFAULT_STORAGE.userSettings });
	const streamerNotifications = ref<Record<string, boolean>>({});

	async function loadSettings() {
		const storage = await getStorage();

		userSettingsState.value = storage.userSettings;
		streamerNotifications.value = storage.streamerNotifications;
	}

	async function updateSettings(partialSettings: Partial<UserSettings>) {
		Object.assign(userSettingsState.value, partialSettings);

		const storage = await getStorage();

		storage.userSettings = userSettingsState.value;

		await saveStorage(storage);
	}

	async function toggleStreamerNotification(streamerId: string) {
		const current = streamerNotifications.value[streamerId] ?? false;

		streamerNotifications.value = {
			...streamerNotifications.value,
			[streamerId]: !current,
		};

		const storage = await getStorage();
		storage.streamerNotifications = streamerNotifications.value;
		await saveStorage(storage);
	}

	async function setAllStreamerNotifications(enabled: boolean, allStreamerIds: string[]) {
		const storage = await getStorage();

		// Update the global toggle
		storage.userSettings.enableAllNotifications = enabled;
		userSettingsState.value.enableAllNotifications = enabled;

		// Enable/disable for ALL followed streamers
		const newNotifications: Record<string, boolean> = {};

		for (const id of allStreamerIds) {
			newNotifications[id] = enabled;
		}

		streamerNotifications.value = newNotifications;
		storage.streamerNotifications = newNotifications;

		await saveStorage(storage);
	}

	return {
		userSettingsState,
		streamerNotifications,
		updateSettings,
		loadSettings,
		toggleStreamerNotification,
		setAllStreamerNotifications,
	};
});
