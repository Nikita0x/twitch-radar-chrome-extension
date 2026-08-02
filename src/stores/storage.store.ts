import { DEFAULT_STORAGE, getStorage } from '@/services/storage.service';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStorageStore = defineStore('storage', () => {
	const storage = ref(DEFAULT_STORAGE);

	async function load() {
		storage.value = await getStorage();
	}

	chrome.storage.onChanged.addListener(async () => {
		storage.value = await getStorage();
	});

	return {
		storage,
		load,
	};
});
