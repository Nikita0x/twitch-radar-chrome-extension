import type { StreamersDetails } from '@/stores/twitch.store';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Screen = 'favorites' | 'settings' | 'streamer-settings';

export const useNavigationStore = defineStore('navigation', () => {
	const activeScreen = ref<Screen>('favorites');
	const selectedStreamer = ref<StreamersDetails | null>(null);

	return {
		activeScreen,
		selectedStreamer,
	};
});
