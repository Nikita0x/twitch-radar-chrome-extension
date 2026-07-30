<template>
	<div class="options-page">
		<div class="card">
			<div class="icon-wrapper">
				<svg
					class="gear-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="3" />
					<path
						d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
					/>
				</svg>
			</div>

			<h1 class="title">Settings</h1>
			<p class="subtitle">Coming Soon</p>

			<div class="divider" />

			<p class="description">
				This page is under construction.<br />
				All settings are currently available directly in the extension popup.
			</p>

			<div class="dots">
				<span class="dot" />
				<span class="dot" />
				<span class="dot" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Options page — placeholder
</script>

<style scoped>
.options-page {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	padding: 24px;
	background: #1a1a2e;
}

.card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	max-width: 400px;
	width: 100%;
	padding: 48px 32px;
	border-radius: 16px;
	background: var(--color-bg-secondary);
	border: 1px solid var(--color-border);
	text-align: center;
}

.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72px;
	height: 72px;
	border-radius: 50%;
	background: var(--color-accent);
	color: #ffffff;
}

.gear-icon {
	width: 36px;
	height: 36px;
	animation: spin 8s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.title {
	margin: 0;
	font-size: 28px;
	font-weight: 700;
	color: var(--color-text);
}

.subtitle {
	margin: 0;
	font-size: 18px;
	font-weight: 500;
	color: var(--color-accent);
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

.divider {
	width: 48px;
	height: 3px;
	border-radius: 2px;
	background: var(--color-accent);
	margin: 4px 0;
}

.description {
	margin: 0;
	font-size: 14px;
	line-height: 1.6;
	color: var(--color-text-muted);
}

.dots {
	display: flex;
	gap: 8px;
	margin-top: 8px;
}

.dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--color-accent);
	opacity: 0.4;
	animation: pulse 1.5s ease-in-out infinite;
}

.dot:nth-child(2) {
	animation-delay: 0.3s;
}

.dot:nth-child(3) {
	animation-delay: 0.6s;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0.4;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.3);
	}
}
</style>
