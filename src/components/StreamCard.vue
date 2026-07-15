<template>
	<a :href="stream.stream_url" target="_blank" rel="noopener noreferrer" class="result-item">
		<img :src="stream.thumbnail_url" class="thumb" />
		<div class="item-info">
			<span class="item-name">{{ stream.display_name }}</span>
			<span class="item-game">{{ stream.game_name || '—' }}</span>
			<div class="meta-row">
				<span class="status-badge online">🔴 Live</span>
				<span class="viewer-count">👁 {{ stream.viewer_count.toLocaleString() }}</span>
				<span class="uptime">⏱ {{ stream.uptime }}</span>
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
interface StreamItem {
	id: string
	display_name: string
	game_name?: string
	thumbnail_url: string
	viewer_count: number
	uptime: string
	stream_url: string
}

defineProps<{
	stream: StreamItem
}>()
</script>

<style scoped>
.result-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px;
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

.viewer-count,
.uptime {
	white-space: nowrap;
}
</style>
