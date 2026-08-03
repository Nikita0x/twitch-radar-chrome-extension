<template>
	<div class="changelog-container">
		<section v-for="release in CHANGELOG" :key="release.version" class="release">
			<div class="release-header">
				<h2 class="release-title">v{{ release.version }}</h2>

				<span class="release-date">
					{{ release.date }}
				</span>
			</div>

			<div class="cards">
				<ChangelogCard v-for="item in release.items" :key="item.title" :item="item" />
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ChangelogCard from './ChangelogCard.vue';
import LivePreviewDemo from './LivePreviewDemo.vue';

interface Changelog {
	version: string;
	date: string;
	items: ChangelogItem[];
}

export interface ChangelogItem {
	icon?: string;
	title: string;
	description?: string;
	bullets?: string[];
	preview?: Component;
}
const CHANGELOG: Changelog[] = [
	// {
	// 	version: '1.5.0',
	// 	date: 'September 2026',
	// 	items: [
	// 		{
	// 			title: 'Some cool new update!',
	// 			description: ' Stay up to day with it!',
	// 			icon: '🦩',
	// 			bullets: [
	// 				'This and that',
	// 				'Removed another feautre',
	// 				'Lorem impsum Lorem impsum Lorem impsum Lorem impsumLorem impsum',
	// 			],
	// 		},
	// 	],
	// },
	{
		version: '1.4.0',
		date: 'August 2026',
		items: [
			{
				icon: '📰',
				title: 'Added Changelog',
				description: 'Keep track of new features, improvements, fixes, and other updates.',
			},
			{
				icon: '✨',
				title: 'Live Previews (Experimental)',
				description:
					'Preview thumbnails now refresh automatically every 30 seconds while the popup is open.',
			},
			{
				icon: '📈',
				title: 'Animated Viewer Count',
				description: 'Viewer count now animates smoothly and highlights increases and decreases.',
				preview: LivePreviewDemo,
			},
			{
				title: 'Other',
				bullets: [
					"Moved red dot (Live) next to a streamer's name.",
					'Removed 🕒 emoji.',
					'Changed viewers icon.',
				],
			},
		],
	},
];
</script>

<style scoped>
.changelog-container {
	display: flex;
	flex-direction: column;
	gap: 28px;
	padding: 16px;
	overflow: auto;
	height: 100%;
	scrollbar-color: var(--color-text-dim) transparent;
}

.changelog-container::-webkit-scrollbar {
	width: 6px;
}

.changelog-container::-webkit-scrollbar-track {
	background: transparent;
}

.changelog-container::-webkit-scrollbar-thumb {
	background: var(--color-text-dim);
	border-radius: 3px;
}

.changelog-container::-webkit-scrollbar-thumb:hover {
	background: var(--color-text-muted);
}

.container {
	display: flex;
	flex-direction: column;
	gap: 28px;

	padding: 16px;
}

.release {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.release-header {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.release-title {
	margin: 0;
	color: var(--color-text);
	font-size: 20px;
	font-weight: 700;
}

.release-date {
	color: var(--color-text-dim);
	font-size: 13px;
}

.cards {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
</style>
