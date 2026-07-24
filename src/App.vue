<template>
	<div class="main-container">
		<HeaderComponent />

		<ScrollContainer :resetScrollPosition="[['favorites', 'settings']]">
			<FavoritesTab v-if="activeScreen === 'favorites'" />

			<StreamerSettingsTab v-if="activeScreen === 'streamer-settings'" />

			<SettingsTab v-if="activeScreen === 'settings'" />
		</ScrollContainer>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import FavoritesTab from './components/FavoritesTab.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import SettingsTab from './components/SettingsTab.vue';
import StreamerSettingsTab from './components/StreamerSettingsTab.vue';

import { useTwitchStore } from '@/stores/twitch.store.ts';
import { useNavigationStore } from './stores/navigation.store.ts';
import { useUserSettingsStore } from './stores/user-settings.store.ts';

import ScrollContainer from './components/ScrollContainer.vue';

import { storeToRefs } from 'pinia';

const twitchStore = useTwitchStore();
const userSettingsStore = useUserSettingsStore();
const navigationStore = useNavigationStore();
const { followedLiveStreams, isAuthenticated } = storeToRefs(twitchStore);
const { activeScreen } = storeToRefs(navigationStore);
const { userSettingsState } = storeToRefs(userSettingsStore);

onMounted(async () => {
	await userSettingsStore.loadSettings();
	userSettingsStore.applyTheme(userSettingsState.value.theme);
	await twitchStore.init();
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
</style>
