<template>
	<div class="app-loader" aria-live="polite">
		<div class="spinner"></div>
		<span><slot /></span>
	</div>
</template>

<style scoped>
.app-loader {
	padding: 10px;
	color: #9146ff;
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
	border: 3px solid rgba(145, 70, 255, 0.2);
	border-top-color: #9146ff;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
