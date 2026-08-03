<template>
	<div class="app-loader" aria-live="polite">
		<div class="twitch-pulse">
			<span class="ring ring-1"></span>
			<span class="ring ring-2"></span>
			<svg
				class="twitch-icon"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				width="26"
				height="26"
			>
				<path
					d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4V420.6H140.1V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H140.1V36.6H449.1z"
					fill="currentColor"
				></path>
			</svg>
		</div>
		<span class="label"><slot /></span>
	</div>
</template>

<style scoped>
.app-loader {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	gap: 14px;

	color: var(--color-text-muted);
	padding: 10px;
	min-height: 120px;
}

.twitch-pulse {
	position: relative;
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.twitch-icon {
	position: relative;
	z-index: 1;
	color: var(--color-accent);
	animation: icon-breathe 1.6s ease-in-out infinite;
}

.ring {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	border: 2px solid var(--color-accent);
	animation: ring-expand 1.6s ease-out infinite;
}

.ring-2 {
	animation-delay: 0.8s;
}

.label {
	font-size: 13px;
}

@keyframes icon-breathe {
	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}

	50% {
		transform: scale(1.12);
		opacity: 0.75;
	}
}

@keyframes ring-expand {
	0% {
		transform: scale(0.55);
		opacity: 0.8;
	}

	100% {
		transform: scale(1.7);
		opacity: 0;
	}
}
</style>
