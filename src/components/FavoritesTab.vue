<template>
	<div class="api-buttons">
		<div class="state-shell">
			<div v-if="loading" class="loading-state" aria-live="polite">
				<div class="spinner"></div>
				<span>Loading streams...</span>
			</div>
			<div v-else-if="error" class="api-error">{{ error }}</div>
			<div v-else-if="!isAuthenticated" class="empty-state auth-prompt">
				<!-- <LoginBackground> -->
				<button class="login-btn" @click="openTwitchLogin">Login with Twitch</button>
				<!-- </LoginBackground> -->
			</div>
			<div v-else-if="followedStreams.length === 0" class="empty-state">No active streams</div>

			<div v-if="isAuthenticated && !loading && visibleStreams.length === 0" class="empty-search">
				<div class="icon">🔍</div>
				<h3>No streamer found</h3>
				<p>Try a different search term</p>
			</div>

			<div v-else class="results-section fade-in">
				<StreamCard
					v-for="(channel, index) in visibleStreams"
					:key="channel.id"
					:stream="channel"
					:style="{ '--index': index }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import StreamCard from './StreamCard.vue'
import { useTwitchStore } from '@/stores/twitch'
import LoginBackground from './LoginBackground.vue'
import type { Sort } from '@/App.vue'

interface Props {
	sort: Sort
	search: string
}
const props = defineProps<Props>()

const twitchStore = useTwitchStore()
const { loading, error, followedStreams, isAuthenticated } = storeToRefs(twitchStore)

async function openTwitchLogin() {
	await twitchStore.loginWithTwitch()
}

const getTime = (date: string) => new Date(date).getTime()

const visibleStreams = computed(() => {
	let result = [...followedStreams.value]

	result = result.filter((stream) =>
		stream.user_name.toLowerCase().includes(props.search.toLowerCase())
	)

	switch (props.sort) {
		case 'viewers:highToLow':
			result.sort((a, b) => b.viewer_count - a.viewer_count)
			break

		case 'viewers:lowToHigh':
			result.sort((a, b) => a.viewer_count - b.viewer_count)
			break

		case 'duration:longest':
			result.sort((a, b) => getTime(a.started_at) - getTime(b.started_at))
			break

		case 'duration:shortest':
			result.sort((a, b) => getTime(b.started_at) - getTime(a.started_at))
			break
	}

	return result
})
</script>

<style scoped>
.api-buttons {
	margin: 12px 0;
	font-family: inherit;
}

.api-error {
	padding: 8px;
	color: #ff4757;
	font-size: 13px;
	background: #fff0f0;
	border-radius: 6px;
	margin-top: 8px;
	text-align: center;
}

.state-shell {
	min-height: 120px;
	position: relative;
}

.loading-state,
.empty-state {
	padding: 15px;
	color: #666;
	text-align: center;
	font-size: 13px;
	min-height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 8px;
}

.loading-state {
	color: #9146ff;
}

.login-btn {
	background-color: #9146ff;
	color: white;
	border: none;
	padding: 10px 20px;
	font-weight: bold;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s ease;
}

.login-btn:hover:not(:disabled) {
	background-color: #772ce8;
}

.login-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.spinner {
	width: 24px;
	height: 24px;
	border: 3px solid rgba(145, 70, 255, 0.2);
	border-top-color: #9146ff;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
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
	/* gap: 6px; */
}

.results-section :deep(.card) {
	animation: cardWaveIn 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	animation-delay: calc(var(--index, 0) * 70ms);
	will-change: transform, opacity;
}

@keyframes cardWaveIn {
	from {
		opacity: 0;
		transform: translateY(10px) scale(0.98);
	}

	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.result-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 8px;
	border-bottom: 1px solid #f0f0f0;
	color: inherit;
	text-decoration: none;
	cursor: pointer;
	border-radius: 8px;
	transition:
		background-color 0.2s ease,
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

.result-item:hover {
	background-color: #f5f0ff;
	transform: translateY(-1px);
	box-shadow: 0 2px 8px rgba(145, 70, 255, 0.12);
}

.result-item:last-child {
	border-bottom: none;
}

.thumb {
	width: 40px;
	height: 40px;
	border-radius: 6px;
	object-fit: cover;
	background: #eee;
	flex-shrink: 0;
}

.item-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
	font-size: 12px;
	flex: 1;
	min-width: 0;
}

.item-name {
	font-weight: bold;
	color: #222;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.item-game {
	color: #666;
	font-size: 11px;
}

.meta-row {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 2px;
	font-size: 11px;
	color: #666;
}

.status-badge {
	font-size: 11px;
	font-weight: bold;
}

.online {
	color: #e91916;
}

.empty-search {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	min-height: 180px;

	text-align: center;

	color: #9ca3af;
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
	color: #888;
}
</style>
