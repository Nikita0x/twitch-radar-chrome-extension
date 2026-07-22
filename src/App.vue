<template>
	<div class="extension-shell">
		<HeaderComponent style="margin-bottom: 10px" v-model="activeTab" />
		<div
			v-if="isAuthenticated && activeTab === 'favorites'"
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
		<FavoritesTab v-if="activeTab === 'favorites'" :sort="userSettingsState.sort" :search />
		<SettingsTab v-else />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
import SettingsTab from './components/SettingsTab.vue';
import FavoritesTab from './components/FavoritesTab.vue';

import { useTwitchStore } from '@/stores/twitch';
import { useUserSettings } from './stores/user-settings.ts';
import { storeToRefs } from 'pinia';

const twitchStore = useTwitchStore();
const userSettingsStore = useUserSettings();
const { followedLiveStreams, isAuthenticated } = storeToRefs(twitchStore);
const { userSettingsState } = storeToRefs(userSettingsStore);

export type Tabs = 'favorites' | 'settings';

const activeTab = ref<Tabs>('favorites');
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
.extension-shell {
	width: 500px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	background: var(--color-bg);
}

.toolbar {
	display: flex;
	gap: 5px;
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
