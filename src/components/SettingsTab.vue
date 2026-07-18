<template>
	<div class="twitch-auth">
		<!-- Notifications toggle -->
		<div class="setting-row">
			<label class="toggle-label">
				<input type="checkbox" v-model="notificationsEnabled" @change="saveNotificationSetting" />
				Enable notifications
			</label>
		</div>

		<div class="state-shell">
			<div v-if="loading" class="loading" aria-live="polite">
				<div class="spinner"></div>
				<span>Loading...</span>
			</div>
			<div v-else-if="error" class="error">
				<p>{{ error }}</p>
				<button @click="error = null" class="retry-btn">Try again</button>
			</div>
			<div v-else-if="twitchUser" class="user-card fade-in">
				<img :src="twitchUser.profile_image_url" class="avatar" />
				<div class="user-info">
					<p class="user-name">{{ twitchUser.display_name }}</p>
					<p class="user-id">ID: {{ twitchUser.id }}</p>
					<p v-if="twitchUser.email" class="user-email">Email: {{ twitchUser.email }}</p>
					<p v-if="twitchUser.description" class="user-desc">{{ twitchUser.description }}</p>
					<p
						v-if="twitchUser.broadcaster_type && twitchUser.broadcaster_type !== ''"
						class="user-type"
					>
						Тип: {{ twitchUser.broadcaster_type }}
					</p>
					<p v-if="twitchUser.created_at" class="user-created">
						На Twitch с: {{ new Date(twitchUser.created_at).toLocaleDateString() }}
					</p>
					<p v-if="twitchUser.view_count !== undefined" class="user-views">
						Views: {{ twitchUser.view_count.toLocaleString() }}
					</p>
				</div>
				<button @click="twitchStore.logout" class="logout-btn">Logout</button>
			</div>
			<button v-else @click="loginWithTwitch" class="login-btn" :disabled="loading">
				Login with Twitch
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTwitchStore } from '@/stores/twitch'

const twitchStore = useTwitchStore()
const { twitchUser, loading, error } = storeToRefs(twitchStore)

const notificationsEnabled = ref(true)

onMounted(async () => {
	const { notificationsEnabled: saved } = await chrome.storage.local.get('notificationsEnabled')
	notificationsEnabled.value = saved !== false // по умолчанию true если не задано
})

function saveNotificationSetting() {
	chrome.storage.local.set({ notificationsEnabled: notificationsEnabled.value })
}

async function loginWithTwitch() {
	await twitchStore.loginWithTwitch()
}
</script>

<style scoped>
.twitch-auth {
	margin: 15px 0;
	text-align: center;
	font-family: inherit;
}

.setting-row {
	padding: 8px 16px;
	text-align: left;
	border-bottom: 1px solid #eee;
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

.logout-btn {
	background-color: #ff4757;
	color: white;
	border: none;
	padding: 5px 10px;
	border-radius: 4px;
	cursor: pointer;
}

.logout-btn:hover {
	background-color: #e0404e;
}

.user-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 12px;
	background: #f8f8f8;
	border-radius: 8px;
	width: 100%;
	animation: fadeIn 0.2s ease;
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

.user-info {
	text-align: left;
	width: 100%;
	font-size: 13px;
	line-height: 1.5;
}

.user-name {
	font-size: 16px;
	font-weight: bold;
	margin: 0 0 4px 0;
	text-align: center;
}

.user-id,
.user-email,
.user-desc,
.user-type,
.user-created,
.user-views {
	margin: 2px 0;
	color: #555;
}

.user-desc {
	font-style: italic;
	color: #777;
}

.avatar {
	width: 64px;
	height: 64px;
	border-radius: 50%;
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
</style>
