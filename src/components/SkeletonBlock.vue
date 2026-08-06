<template>
	<span
		class="skeleton-block"
		:style="{
			width: toSize(props.width),
			height: toSize(props.height),
			borderRadius: props.radius,
		}"
	></span>
</template>

<script setup lang="ts">
interface Props {
	width?: string | number;
	height?: string | number;
	radius?: string;
}

const props = withDefaults(defineProps<Props>(), {
	width: '100%',
	height: '1em',
	radius: '4px',
});

function toSize(value: string | number) {
	return typeof value === 'number' ? `${value}px` : value;
}
</script>

<style scoped>
.skeleton-block {
	display: block;
	flex-shrink: 0;

	background: linear-gradient(
		90deg,
		var(--color-bg-secondary) 25%,
		var(--color-border) 50%,
		var(--color-bg-secondary) 75%
	);
	background-size: 200% 100%;

	animation: skeleton-loading 2s ease-in-out infinite;
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
