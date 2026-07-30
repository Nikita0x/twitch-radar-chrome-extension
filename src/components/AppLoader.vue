<template>
	<div class="app-loader" aria-live="polite">
		<div class="spinner"></div>
		<span><slot /></span>
	</div>
</template>

<style scoped>
.app-loader {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	gap: 8px;

	/* background: green; */
	color: var(--color-text-muted);
	padding: 10px;
	min-height: 120px;
}

.spinner {
	width: 24px;
	height: 24px;
	border: 3px solid var(--color-border);
	border-top-color: var(--color-accent);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
