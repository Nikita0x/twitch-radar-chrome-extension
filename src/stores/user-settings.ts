import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { UserSettings } from '@/services/storage.service'
import { getStorage, saveStorage } from '@/services/storage.service'
import { DEFAULT_STORAGE } from '@/services/storage.service'

export const useUserSettings = defineStore('user-settings', () => {
	const userSettingsState = ref<UserSettings>({ ...DEFAULT_STORAGE.userSettings })

	async function loadSettings() {
		const storage = await getStorage()

		userSettingsState.value = storage.userSettings
	}

	async function updateSettings(partialSettings: Partial<UserSettings>) {
		Object.assign(userSettingsState.value, partialSettings)

		const storage = await getStorage()

		storage.userSettings = userSettingsState.value

		await saveStorage(storage)
	}

	return { userSettingsState, updateSettings, loadSettings }
})
