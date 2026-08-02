<template>
	<div class="main-container">
		<HeaderComponent />

		<Transition name="screen" mode="out-in">
			<FavoritesTab v-if="currentScreen === 'favorites'" />

			<StreamerSettingsTab v-if="currentScreen === 'streamer-settings'" />

			<SettingsTab v-if="currentScreen === 'settings'" />
			<TestingTab v-if="currentScreen === 'testing'" />
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import FavoritesTab from './components/FavoritesTab.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import SettingsTab from './components/SettingsTab.vue';
import StreamerSettingsTab from './components/StreamerSettingsTab.vue';
import TestingTab from './components/TestingTab.vue';

import { useTwitchStore } from '@/stores/twitch.store.ts';
import { useNavigationStore } from './stores/navigation.store.ts';
import { useUserSettingsStore } from './stores/user-settings.store.ts';
import { useStorageStore } from './stores/storage.store.ts';

import { storeToRefs } from 'pinia';

const twitchStore = useTwitchStore();
const userSettingsStore = useUserSettingsStore();
const navigationStore = useNavigationStore();
const storageStore = useStorageStore();
const { followedLiveStreams, isAuthenticated } = storeToRefs(twitchStore);
const { currentScreen } = storeToRefs(navigationStore);
const { userSettingsState } = storeToRefs(userSettingsStore);

onMounted(async () => {
	await userSettingsStore.loadSettings();
	userSettingsStore.applyTheme(userSettingsState.value.theme);
	await twitchStore.init();
	await storageStore.load();
});
</script>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	height: 600px;
	width: 500px;
	background: var(--color-bg);
}

.screen-enter-active,
.screen-leave-active {
	transition:
		opacity 220ms ease-in-out,
		transform 220ms ease-in-out;
}

.screen-enter-from {
	opacity: 0;
	transform: translateX(12px);
}

.screen-leave-to {
	opacity: 0;
	transform: translateX(-12px);
}
</style>
