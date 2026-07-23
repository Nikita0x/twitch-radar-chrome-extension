<template>
	<div class="api-buttons">
		<div class="state-shell">
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
				<StreamCard
					v-for="(channel, index) in visibleStreams"
					:key="channel.id"
					:stream="channel"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import StreamCard from './StreamCard.vue';
import AppLoader from './AppLoader.vue';
import AuthPrompt from './AuthPrompt.vue';
import { useTwitchStore } from '@/stores/twitch.store.ts';
import { useUserSettingsStore } from '@/stores/user-settings.store.ts';

interface Props {
	search: string;
}
const props = defineProps<Props>();

const twitchStore = useTwitchStore();
const userSettings = useUserSettingsStore();
const { loading, error, followedLiveStreams, isAuthenticated } = storeToRefs(twitchStore);
const { userSettingsState } = storeToRefs(userSettings);

const getTime = (date: string) => new Date(date).getTime();

const visibleStreams = computed(() => {
	let result = [...followedLiveStreams.value];

	result = result.filter((stream) =>
		stream.user_name.toLowerCase().includes(props.search.toLowerCase())
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
</script>

<style scoped>
.api-buttons {
	margin: 12px 0;
	font-family: inherit;
	background: var(--color-bg);
}

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

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(4px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.results-section {
	display: flex;
	flex-direction: column;
}

.results-inner {
	display: flex;
	flex-direction: column;
}

/* ── Filter animation (TransitionGroup) ── */
.filter-enter-active {
	transition: all 150ms cubic-bezier(0.22, 1, 0.36, 1);
}

.filter-leave-active {
	transition: all 100ms cubic-bezier(0.22, 1, 0.36, 1);
	position: absolute;
}

.filter-move {
	transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1);
}

.filter-enter-from {
	opacity: 0;
	transform: scale(0.97);
}

.filter-leave-to {
	opacity: 0;
	transform: scale(0.97);
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
</style>
