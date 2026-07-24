<template>
	<div class="main-container">
		<HeaderComponent />
		<div
			v-if="isAuthenticated && activeScreen === 'favorites'"
			style="display: flex; padding-inline: 5px"
			class="toolbar"
		>
			<input
				class="search-input"
				ref="search-input"
				placeholder="Streamer name..."
				v-model="search"
			/>
			<div>
				<select
					class="sort-select"
					name="sort"
					id="pet-select"
					v-model="userSettingsState.sort"
					@change="userSettingsStore.updateSettings({ sort: userSettingsState.sort })"
				>
					<option value="viewers:highToLow">Viewers: High to Low</option>
					<option value="viewers:lowToHigh">Viewers: Low to High</option>
					<option value="duration:longest">Duration: Longest</option>
					<option value="duration:shortest">Duration: Shortest</option>
				</select>
			</div>
		</div>
		<ScrollContainer :resetScrollPosition="[['favorites', 'settings']]">
			<FavoritesTab v-if="activeScreen === 'favorites'" :sort="userSettingsState.sort" :search />

			<StreamerSettingsTab v-if="activeScreen === 'streamer-settings'" />

			<SettingsTab v-if="activeScreen === 'settings'" />
		</ScrollContainer>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef, watch, nextTick } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
import SettingsTab from './components/SettingsTab.vue';
import FavoritesTab from './components/FavoritesTab.vue';
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

const search = ref('');
const input = useTemplateRef('search-input');

onMounted(async () => {
	await userSettingsStore.loadSettings();
	userSettingsStore.applyTheme(userSettingsState.value.theme);
	await twitchStore.init();

	input.value?.focus();
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

.toolbar {
	display: flex;
	gap: 5px;
	padding-block: 5px;
	align-items: center;
}

.search-input,
.sort-select {
	height: 38px;

	border: 1px solid var(--color-border-input);
	border-radius: 8px;

	font-size: 13px;
	background: var(--color-bg-input);
	color: var(--color-text);

	transition:
		border-color 0.2s,
		box-shadow 0.2s,
		background 0.2s;
}

.search-input {
	flex: 1;
	padding: 0 5px;
}

.search-input::placeholder {
	color: var(--color-text-dim);
}

.search-input:focus,
.sort-select:focus {
	outline: none;

	border-color: var(--color-accent);

	box-shadow: 0 0 0 3px rgba(145, 70, 255, 0.18);
}

.sort-select {
	min-width: 180px;

	cursor: pointer;
}
</style>
