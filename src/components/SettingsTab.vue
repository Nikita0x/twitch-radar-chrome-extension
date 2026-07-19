<template>
	<div class="twitch-auth">
		<!-- Notifications toggle -->
		<div class="setting-row">
			<label class="toggle-label">
				<input
					type="checkbox"
					:checked="userSettingsState.enableAllNotifications"
					@change="toggleAllNotifications"
				/>
				Enable notifications
			</label>
		</div>

		<div>
			<div v-if="loading" class="loading" aria-live="polite">
				<div class="spinner"></div>
				<span>Loading...</span>
			</div>
			<div v-else-if="error" class="error">
				<p>{{ error }}</p>
				<button @click="error = null" class="retry-btn">Try again</button>
			</div>

			<button
				v-else-if="!isAuthenticated"
				@click="loginWithTwitch"
				class="login-btn"
				:disabled="loading"
			>
				Login with Twitch
			</button>
		</div>

		<div v-if="followedAllStreams.length" class="followed-section">
			<h3 class="section-title">Followed Streamers</h3>
			<input class="search-input" placeholder="Streamer name..." v-model="search" />

			<div v-if="search && filteredStreamers.length === 0" class="empty-search">
				<div class="icon">🔍</div>
				<h3>No streamer found</h3>
				<p>Try a different search term</p>
			</div>

			<div class="results-section">
				<StreamerCard
					v-for="(streamer, index) in filteredStreamers"
					:key="streamer.id"
					:streamer="streamer"
					:style="{ '--index': index }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTwitchStore } from '@/stores/twitch'
import { useUserSettings } from '@/stores/user-settings'
import StreamerCard from './StreamerCard.vue'

const twitchStore = useTwitchStore()
const userSettingsStore = useUserSettings()
const { twitchUser, loading, error, followedAllStreams, isAuthenticated } = storeToRefs(twitchStore)
const { userSettingsState } = storeToRefs(userSettingsStore)

const search = ref('')

const filteredStreamers = computed(() => {
	if (!search.value) return followedAllStreams.value
	const q = search.value.toLowerCase()
	return followedAllStreams.value.filter(
		(s) => s.display_name.toLowerCase().includes(q) || s.login.toLowerCase().includes(q)
	)
})

async function toggleAllNotifications() {
	await userSettingsStore.updateSettings({
		enableAllNotifications: !userSettingsState.value.enableAllNotifications,
	})
}

async function loginWithTwitch() {
	await twitchStore.loginWithTwitch()
}
</script>

<style scoped>
.twitch-auth {
	margin: 15px 0;

	font-family: inherit;
}

.setting-row {
	padding: 8px 16px;
	text-align: left;
}

.toggle-label {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	font-size: 14px;
	user-select: none;
}

.toggle-label input[type='checkbox'] {
	width: 16px;
	height: 16px;
	cursor: pointer;
	accent-color: #9146ff;
}

.state-shell {
	min-height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-btn {
	background-color: #9146ff;
	color: white;
	border: none;
	padding: 10px 20px;
	font-weight: bold;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.login-btn:hover:not(:disabled) {
	background-color: #772ce8;
}

.login-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.fade-in {
	animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(4px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.user-bar {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 12px;
	width: 100%;
	animation: fadeIn 0.2s ease;
}

.user-bar .user-name {
	font-size: 14px;
	font-weight: 600;
	color: #222;
	margin: 0;
	flex: 1;
	text-align: left;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.user-bar .logout-btn {
	margin-left: auto;
	flex-shrink: 0;
}

.loading {
	padding: 10px;
	color: #888;
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

.error {
	padding: 10px;
	color: #ff4757;
	font-size: 14px;
	background: #fff0f0;
	border-radius: 6px;
}

.error p {
	margin: 0 0 8px 0;
	word-break: break-word;
}

.retry-btn {
	background-color: #9146ff;
	color: white;
	border: none;
	padding: 5px 15px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
}

.retry-btn:hover {
	background-color: #772ce8;
}

.followed-section {
	margin-top: 20px;
	border-top: 1px solid #eee;
	padding-top: 12px;
}

.section-title {
	font-size: 14px;
	font-weight: 700;
	color: #333;
	text-align: left;
	padding: 0 5px;
}

.search-input {
	padding: 0 5px;
	margin-inline: 5px;
	height: 38px;
	border: 1px solid #3d3d44;
	border-radius: 8px;
	font-size: 13px;
	transition:
		border-color 0.2s,
		box-shadow 0.2s,
		background 0.2s;
	width: 98%;
	box-sizing: border-box;
}

.search-input::placeholder {
	color: #9b9b9b;
}

.search-input:focus {
	outline: none;
	border-color: #9146ff;
	box-shadow: 0 0 0 3px rgba(145, 70, 255, 0.18);
}

.followed-section :deep(.streamer-card) {
	animation: cardWaveIn 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	animation-delay: calc(var(--index, 0) * 70ms);
	will-change: transform, opacity;
}

@keyframes cardWaveIn {
	from {
		opacity: 0;
		transform: translateY(10px) scale(0.98);
	}

	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.empty-search {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 180px;
	text-align: center;
	color: #9ca3af;
}

.empty-search .icon {
	font-size: 40px;
	margin-bottom: 12px;
	opacity: 0.8;
}

.empty-search h3 {
	margin: 0;
	font-size: 18px;
}

.empty-search p {
	margin-top: 6px;
	font-size: 13px;
	color: #888;
}
</style>
