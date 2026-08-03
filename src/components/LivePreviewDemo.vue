<template>
	<div style="display: flex; align-items: center; gap: 5px">
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			aria-hidden="true"
			style="fill: var(--color-red)"
		>
			<path
				fill-rule="evenodd"
				d="M6 8a6 6 0 1 1 7.025 5.913l.012.036A3 3 0 0 0 15.883 16H17a4 4 0 0 1 4 4v2h-2v-2a2 2 0 0 0-2-2h-1.117A5 5 0 0 1 12 16.15 5 5 0 0 1 8.117 18H7a2 2 0 0 0-2 2v2H3v-2a4 4 0 0 1 4-4h1.117a3 3 0 0 0 2.846-2.051l.012-.036A6.002 6.002 0 0 1 6 8Zm6 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
				clip-rule="evenodd"
			/>
		</svg>

		<AnimatedViewCount :count="count" />
	</div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import AnimatedViewCount from './AnimatedViewCount.vue';

const count = ref(500);
const increasing = ref(true);

const interval = setInterval(() => {
	const delta = Math.floor(Math.random() * 91) + 10; // 10..100

	count.value = increasing.value ? count.value + delta : Math.max(0, count.value - delta);

	increasing.value = !increasing.value;
}, 3000);

onUnmounted(() => clearInterval(interval));
</script>
