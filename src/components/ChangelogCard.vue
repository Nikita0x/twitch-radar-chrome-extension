<template>
	<div class="card">
		<div class="header">
			<span v-if="item.icon">{{ item.icon }}</span>
			<h3>{{ item.title }}</h3>
		</div>

		<p v-if="item.description" class="description">
			{{ item.description }}
		</p>

		<ul v-if="item.bullets" class="bullets">
			<li v-for="bullet in item.bullets" :key="bullet">
				{{ bullet }}
			</li>
		</ul>

		<div v-if="item.preview" class="preview">
			<component :is="item.preview" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ChangelogItem } from './ChangelogTab.vue';

interface Props {
	item: ChangelogItem;
}

defineProps<Props>();
</script>

<style scoped>
.card {
	display: flex;
	flex-direction: column;
	gap: 12px;

	padding: 14px;

	background: var(--color-bg-secondary);

	border: 1px solid var(--color-border);
	border-radius: 10px;
}

.header {
	display: flex;
	align-items: center;
	gap: 10px;
}

.header span {
	font-size: 18px;
}

.header h3 {
	margin: 0;

	font-size: 15px;
	font-weight: 600;
	color: var(--color-text);
}

.description {
	margin: 0;

	font-size: 13px;
	line-height: 1.45;

	color: var(--color-text-dim);
}

.preview {
	width: fit-content;
	border-radius: 8px;
	overflow: hidden;

	background: var(--color-bg);
	border: 1px solid var(--color-border);

	padding: 10px;
}

.bullets {
	margin: 0;
	padding-left: 18px;

	color: var(--color-text-dim);
	font-size: 13px;
	line-height: 1.6;
}

.bullets li + li {
	margin-top: 4px;
}

.bullets li::marker {
	color: var(--color-primary);
}
</style>
