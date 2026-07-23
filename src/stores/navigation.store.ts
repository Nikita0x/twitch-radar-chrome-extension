import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { UserSettings } from '@/services/storage.service';
import { getStorage, saveStorage } from '@/services/storage.service';
import { DEFAULT_STORAGE } from '@/services/storage.service';
import type { StreamersDetails } from '@/stores/twitch.store';

export type Screen = 'favorites' | 'settings' | 'streamer-settings';

export const useNavigationStore = defineStore('navigation', () => {
	const activeScreen = ref<Screen>('favorites');
	const selectedStreamer = ref<StreamersDetails | null>(null);

	return {
		activeScreen,
		selectedStreamer,
	};
});
