<template>
	<a
		:href="`https://twitch.com/${props.stream.user_login}`"
		target="_blank"
		rel="noopener noreferrer"
		class="card"
		:title="props.stream.title"
	>
		<div class="thumb-wrap">
			<div v-if="!imageLoaded" class="thumb-skeleton"></div>

			<img
				:src="props.stream.thumbnail_url.replace('{width}', '200').replace('{height}', '100')"
				class="thumb"
				:class="{ loaded: imageLoaded }"
				width="200"
				height="100"
				@load="imageLoaded = true"
			/>

			<div class="thumb-overlay">
				<span class="thumb-user">{{ props.stream.user_name }}</span>
			</div>
		</div>

		<div class="card-info">
			<div>
				<p class="card-name">{{ props.stream.title }}</p>
				<p class="card-game">{{ props.stream.game_name || '—' }}</p>
			</div>
			<div class="meta-row">
				<div style="display: flex; align-items: center; gap: 5px">
					<span class="live"></span>
					<span class="viewer-count">{{ props.stream.viewer_count }}</span>
				</div>

				<span class="uptime"
					><span style="transform: translateY(1px); display: inline-block">🕒</span
					>{{ formatUptime(props.stream.started_at) }}</span
				>
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FollowData } from '@/stores/twitch.store';
import { formatUptime } from '@/utils/utils';

interface Props {
	stream: FollowData;
}

const props = defineProps<Props>();

const imageLoaded = ref(false);
</script>

<style scoped>
.card {
	display: flex;

	gap: 10px;
	border-bottom: 1px solid var(--color-border);
	color: inherit;
	text-decoration: none;
	cursor: pointer;
	padding: 5px;
	transition: all 0.2s ease;
}

.card:hover {
	background: var(--color-bg-secondary);

	transform: translateY(-1px);
	box-shadow: 0 2px 8px rgba(145, 70, 255, 0.12);
}

.card:last-child {
	border-bottom: none;
}

.thumb-wrap {
	position: relative;
	flex-shrink: 0;
	overflow: hidden;
}

.thumb {
	display: block;
	width: 200px;
	height: 100px;
	object-fit: cover;

	opacity: 0;
	transform: scale(1.03);
	filter: blur(8px);

	transition:
		opacity 0.3s ease,
		transform 0.3s ease,
		filter 0.3s ease;
}

.thumb.loaded {
	opacity: 1;
	transform: scale(1);
	filter: blur(0);
}

.thumb-overlay {
	position: absolute;
	left: 0;
	bottom: 0;
	padding: 7px 9px;
	box-sizing: border-box;

	background: rgba(0, 0, 0, 0.6);
}
.thumb-user {
	color: white;
	font-size: 15px;
	letter-spacing: 0.02em;
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.card-info {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 10px;
	font-size: 12px;
	flex: 1;
}

.card-name {
	font-weight: bold;
	color: var(--color-text);
	overflow: hidden;
	font-size: 15px;

	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
}

.card-game {
	color: var(--color-text-dim);
	font-size: 14px;
}

.meta-row {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 13px;
	justify-content: space-between;
}

.live {
	display: inline-block;
	width: 1em;
	height: 1em;
	border-radius: 50%;
	background-color: var(--color-red);
}

.viewer-count {
	font-weight: 700;
	color: var(--color-text);
}

.uptime {
	display: flex;
	align-items: center;
	color: var(--color-text);
}

.thumb-skeleton {
	position: absolute;
	inset: 0;

	background: linear-gradient(
		90deg,
		var(--color-bg-secondary) 25%,
		var(--color-border) 50%,
		var(--color-bg-secondary) 75%
	);

	background-size: 200% 100%;

	animation: skeleton-loading 1.2s infinite;
}

@keyframes skeleton-loading {
	from {
		background-position: 200% 0;
	}

	to {
		background-position: -200% 0;
	}
}
</style>
