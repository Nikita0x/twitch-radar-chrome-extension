import type { StreamersDetails } from '@/stores/twitch.store';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type Screen = 'favorites' | 'settings' | 'streamer-settings';

export interface NavigationState {
	current: Screen;
	previous: Screen | null;
	scrollPositions: Partial<Record<Screen, number>>;
}

export const useNavigationStore = defineStore('navigation', () => {
	const _state = ref<NavigationState>({
		current: 'favorites',
		previous: null,
		scrollPositions: {},
	});

	const selectedStreamer = ref<StreamersDetails | null>(null);

	function navigateTo(screen: Screen) {
		if (screen === _state.value.current) return;

		_state.value.previous = _state.value.current;
		_state.value.current = screen;
	}

	function saveScrollPosition(screen: Screen, scrollTop: number) {
		_state.value.scrollPositions[screen] = scrollTop;
	}

	function getScrollPosition(screen: Screen) {
		return _state.value.scrollPositions[screen] ?? 0;
	}

	const currentScreen = computed(() => _state.value.current);
	const previousScreen = computed(() => _state.value.previous);

	return {
		selectedStreamer,
		navigateTo,
		saveScrollPosition,
		getScrollPosition,
		currentScreen,
		previousScreen,
	};
});
