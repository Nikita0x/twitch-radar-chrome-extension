<template>
	<span
		v-if="props.type === 'partner'"
		class="badge partner"
		title="Top creators with additional features and benefits."
		>Partner</span
	>
	<span
		v-else-if="props.type === 'affiliate'"
		class="badge affiliate"
		title="Can earn revenue through subscriptions, Bits, and ads."
		>Affiliate</span
	>
</template>

<script setup lang="ts">
interface Props {
	type: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.badge {
	font-size: 10px;
	font-weight: 700;
	padding: 2px 6px;
	border-radius: 4px;
	text-transform: uppercase;
	cursor: help;
	width: fit-content;
}

.badge.partner {
	background: var(--color-accent);
	color: white;
}

.badge.affiliate {
	background: var(--color-bg-secondary);
	color: var(--color-accent);
}
</style>
