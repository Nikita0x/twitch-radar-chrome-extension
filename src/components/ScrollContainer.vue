<template>
	<div ref="container" class="scroll-container">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { watch, nextTick, useTemplateRef } from 'vue';
import type { Screen } from '@/stores/navigation.store';
import { useNavigationStore } from '@/stores/navigation.store';
import { storeToRefs } from 'pinia';

interface Props {
	/**
	 * Screen transitions that should reset the scroll position.
	 *
	 * Format: `[fromScreen, toScreen]`.
	 */
	resetScrollPosition?: [Screen, Screen][];
}

const props = defineProps<Props>();
const container = useTemplateRef('container');

const navigationStore = useNavigationStore();
const { activeScreen } = storeToRefs(navigationStore);

const positions = new Map<Screen, number>();

function shouldResetScroll(from: string, to: string): boolean {
	if (!props.resetScrollPosition || !from) return false;
	return props.resetScrollPosition.some(([fromScreen, toScreen]) => {
		return (from === fromScreen && to === toScreen) || (from === toScreen && to === fromScreen);
	});
}

watch(activeScreen, async (newScreen, oldScreen) => {
	if (!container.value) return;

	if (oldScreen) {
		positions.set(oldScreen, container.value.scrollTop);
	}

	await nextTick();

	container.value.scrollTop = shouldResetScroll(oldScreen, newScreen)
		? 0
		: (positions.get(newScreen) ?? 0);
});
</script>

<style scoped>
.scroll-container {
	overflow-y: auto;
	scrollbar-color: var(--color-text) var(--color-bg-secondary);
}
</style>
