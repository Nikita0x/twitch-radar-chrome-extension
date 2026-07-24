<template>
	<div class="state-shell">
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

		<AppLoader v-if="loading">Loading streams...</AppLoader>
		<AuthPrompt v-else-if="!isAuthenticated" />
		<div v-else-if="error" class="api-error">{{ error }}</div>
		<div v-else-if="followedLiveStreams.length === 0" class="empty-state">No active streams</div>
		<div v-else-if="visibleStreams.length === 0" class="empty-search">
			<div class="icon">🔍</div>
			<h3>No streamer found</h3>
			<p>Try a different search term</p>
		</div>
		<div v-else class="results-section fade-in">
			<StreamCard v-for="(channel, index) in visibleStreams" :key="channel.id" :stream="channel" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import StreamCard from './StreamCard.vue';
import AppLoader from './AppLoader.vue';
import AuthPrompt from './AuthPrompt.vue';
import { useTwitchStore } from '@/stores/twitch.store.ts';
import { useUserSettingsStore } from '@/stores/user-settings.store.ts';
import { useNavigationStore } from '@/stores/navigation.store.ts';

// interface Props {
// 	search: string;
// }
// const props = defineProps<Props>();

const twitchStore = useTwitchStore();
const userSettingsStore = useUserSettingsStore();
const navigationStore = useNavigationStore();
const { loading, error, followedLiveStreams, isAuthenticated } = storeToRefs(twitchStore);
const { userSettingsState } = storeToRefs(userSettingsStore);
const { activeScreen } = storeToRefs(navigationStore);

const search = ref('');
const inputRef = useTemplateRef('search-input');

const getTime = (date: string) => new Date(date).getTime();

const visibleStreams = computed(() => {
	let result = [...followedLiveStreams.value];

	result = result.filter((stream) =>
		stream.user_name.toLowerCase().includes(search.value.toLowerCase())
	);

	switch (userSettingsState.value.sort) {
		case 'viewers:highToLow':
			result.sort((a, b) => b.viewer_count - a.viewer_count);
			break;

		case 'viewers:lowToHigh':
			result.sort((a, b) => a.viewer_count - b.viewer_count);
			break;

		case 'duration:longest':
			result.sort((a, b) => getTime(a.started_at) - getTime(b.started_at));
			break;

		case 'duration:shortest':
			result.sort((a, b) => getTime(b.started_at) - getTime(a.started_at));
			break;
	}

	return result;
});

watch(inputRef, (input) => {
	input?.focus();
});
</script>

<style scoped>
.api-error {
	padding: 8px;
	color: var(--color-error);
	font-size: 13px;
	background: var(--color-error-bg);
	border-radius: 6px;
	margin-top: 8px;
	text-align: center;
}

.state-shell {
	min-height: 120px;
	position: relative;
}

.empty-state {
	padding: 15px;
	color: var(--color-text-muted);
	text-align: center;
	font-size: 13px;
	min-height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 8px;
}

.results-section {
	display: flex;
	flex-direction: column;
}

.results-inner {
	display: flex;
	flex-direction: column;
}

.empty-search {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 180px;
	text-align: center;
	color: var(--color-text-muted);
}

.empty-search .icon {
	font-size: 40px;
	margin-bottom: 12px;
	opacity: 0.8;
}

.empty-search h3 {
	margin: 0;
	font-size: 18px;
}

.empty-search p {
	margin-top: 6px;
	font-size: 13px;
	color: var(--color-text-dim);
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
