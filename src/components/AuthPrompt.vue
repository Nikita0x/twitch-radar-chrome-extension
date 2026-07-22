<template>
	<div class="auth-card">
		<div class="auth-card-inner">
			<div class="auth-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					width="40"
					height="40"
				>
					<rect x="2" y="3" width="20" height="14" rx="2" />
					<path d="M8 21h8" />
					<path d="M12 17v4" />
				</svg>
			</div>
			<h2 class="auth-title">Never Miss a Live Stream</h2>
			<p class="auth-text">
				This extension needs you to sign in with Twitch to show your followed streams and send live
				notifications.
			</p>
			<div class="auth-info">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					width="16"
					height="16"
				>
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
				<span
					>We only request <strong>read-only</strong> access to your followed channels. Your email
					is never requested or stored.</span
				>
			</div>
			<div class="auth-info">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					width="16"
					height="16"
				>
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
				<span>Authentication happens entirely via Twitch — we never see your password.</span>
			</div>
			<button class="auth-btn" @click="login">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					width="19.2"
					height="19.2"
					class=""
				>
					<path
						d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4V420.6H140.1V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H140.1V36.6H449.1z"
						fill="currentColor"
					></path>
				</svg>
				Continue with Twitch
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTwitchStore } from '@/stores/twitch';

const twitchStore = useTwitchStore();

async function login() {
	await twitchStore.loginWithTwitch();
}
</script>

<style scoped>
.auth-card {
	margin: 20px 12px;
	padding: 1px;
	border-radius: 14px;
}

.auth-card-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	padding: 28px 20px 24px;
	border-radius: 13px;
	background: var(--color-bg-primary);
	text-align: center;
}

.auth-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--color-accent-gradient);
	color: white;
	margin-bottom: 4px;
}

.auth-title {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	color: var(--color-text-dark);
}

.auth-text {
	margin: 0;
	font-size: 13px;
	line-height: 1.5;
	color: var(--color-text-notif-desc);
	max-width: 280px;
}

.auth-info {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	font-size: 12px;
	line-height: 1.4;
	color: var(--color-text-muted);
	text-align: left;
	max-width: 280px;
}

.auth-info svg {
	flex-shrink: 0;
	margin-top: 1px;
	color: var(--color-accent);
}

.auth-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	margin-top: 4px;
	background: var(--color-accent-gradient);
	color: white;
	border: none;
	padding: 11px 22px;
	font-weight: 700;
	font-size: 14px;
	border-radius: 8px;
	cursor: pointer;
	transition:
		opacity 0.2s,
		transform 0.15s;
}

.auth-btn:hover {
	opacity: 0.92;
	transform: translateY(-1px);
}

.auth-btn:active {
	transform: translateY(0);
}
</style>
