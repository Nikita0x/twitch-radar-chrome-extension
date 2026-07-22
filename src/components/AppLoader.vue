<template>
	<div class="app-loader" aria-live="polite">
		<div class="spinner"></div>
		<span><slot /></span>
	</div>
</template>

<style scoped>
.app-loader {
	padding: 10px;
	color: var(--color-spinner-text);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	min-height: 120px;
}

.spinner {
	width: 24px;
	height: 24px;
	border: 3px solid var(--color-spinner-border);
	border-top-color: var(--color-spinner-top);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
