<template>
	<div class="twitch-auth">
		<!-- Notifications toggle -->
		<div v-if="isAuthenticated" class="setting-row">
			<label class="toggle-label">
				<input
					type="checkbox"
					:checked="userSettingsState.enableAllNotifications"
					@change="toggleAllNotifications"
				/>
				Enable all notifications
			</label>
		</div>

		<!-- Theme toggle -->
		<div v-if="isAuthenticated" class="setting-row">
			<label class="toggle-label">
				<input
					type="checkbox"
					:checked="userSettingsState.theme === 'dark'"
					@change="userSettingsStore.toggleTheme()"
				/>
				Dark theme
			</label>
		</div>

		<template>
			<AppLoader v-if="localLoading">Loading...</AppLoader>
			<div v-else-if="error" class="error">
				<p>{{ error }}</p>
				<button @click="error = null" class="retry-btn">Try again</button>
			</div>
		</template>

		<div v-if="followedAllStreams.length" class="followed-section">
			<h3 class="section-title">Followed Streamers ({{ followedAllStreams.length }})</h3>
			<input
				ref="search-input"
				class="search-input"
				placeholder="Streamer name..."
				v-model="search"
			/>

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
					:isLive="liveStreamerIds.has(streamer.id)"
					:notificationsEnabled="!!streamerNotifications[streamer.id]"
					@toggleNotifications="handleToggleNotifications"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useTwitchStore } from '@/stores/twitch.store.ts';
import { useUserSettingsStore } from '@/stores/user-settings.store.ts';

import AppLoader from './AppLoader.vue';
import StreamerCard from './StreamerCard.vue';

const twitchStore = useTwitchStore();
const userSettingsStore = useUserSettingsStore();

const { twitchUser, loading, error, followedAllStreams, followedLiveStreams, isAuthenticated } =
	storeToRefs(twitchStore);
const { userSettingsState, streamerNotifications } = storeToRefs(userSettingsStore);

const search = ref('');
const searchRef = useTemplateRef('search-input');

/** Local loading — stays true until all data (including followedAllStreams) is loaded */
const localLoading = computed(
	() =>
		loading.value ||
		(isAuthenticated.value && followedAllStreams.value.length === 0 && !error.value)
);

/** Set of live streamer IDs for O(1) lookup */
const liveStreamerIds = computed(() => new Set(followedLiveStreams.value.map((s) => s.user_id)));

const filteredStreamers = computed(() => {
	// Берём ВСЕХ фолловеров (и онлайн, и оффлайн)
	let list = followedAllStreams.value;

	// Если пользователь что-то ввёл в поиск — фильтруем по имени
	if (search.value) {
		const q = search.value.toLowerCase();
		list = list.filter(
			(s) => s.display_name.toLowerCase().includes(q) || s.login.toLowerCase().includes(q)
		);
	}

	// Сортируем: сначала те, кто в онлайне, потом оффлайн
	return [...list].sort((a, b) => {
		// Если стример в liveStreamerIds — он онлайн → 0, иначе → 1
		const aLive = liveStreamerIds.value.has(a.id) ? 0 : 1;
		const bLive = liveStreamerIds.value.has(b.id) ? 0 : 1;
		// 0 - 0 = 0 (оба онлайн/оффлайн — не меняем порядок)
		// 0 - 1 = -1 (a онлайн, b оффлайн → a выше)
		// 1 - 0 = 1 (a оффлайн, b онлайн → b выше)
		return aLive - bLive;
	});
});

async function toggleAllNotifications() {
	const enabled = !userSettingsState.value.enableAllNotifications;
	const allStreamerIds = followedAllStreams.value.map((s) => s.id);
	await userSettingsStore.setAllStreamerNotifications(enabled, allStreamerIds);
}

async function handleToggleNotifications(streamerId: string) {
	await userSettingsStore.toggleStreamerNotification(streamerId);
}

onMounted(() => {
	if (!searchRef.value) return;

	searchRef.value.focus();
});
</script>

<style scoped>
.twitch-auth {
	background: var(--color-bg);
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
	color: var(--color-text);
}

.toggle-label input[type='checkbox'] {
	width: 16px;
	height: 16px;
	cursor: pointer;
	accent-color: var(--color-accent);
}

.error {
	padding: 10px;
	color: var(--color-error);
	font-size: 14px;
	background: var(--color-error-bg);
	border-radius: 6px;
}

.error p {
	margin: 0 0 8px 0;
	word-break: break-word;
}

.retry-btn {
	background-color: var(--color-accent);
	color: white;
	border: none;
	padding: 5px 15px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
}

.retry-btn:hover {
	background-color: var(--color-accent-hover);
}

.followed-section {
	border-top: 1px solid var(--color-border);
	padding-top: 12px;
}

.section-title {
	font-size: 14px;
	font-weight: 700;
	color: var(--color-text);
	text-align: left;
	padding: 0 5px;
}

.search-input {
	padding: 0 5px;
	margin-inline: 5px;
	height: 38px;
	border: 1px solid var(--color-border-input);
	border-radius: 8px;
	font-size: 13px;
	background: var(--color-bg-input);
	color: var(--color-text);
	transition:
		border-color 0.2s,
		box-shadow 0.2s,
		background 0.2s;
	width: 98%;
	margin-bottom: 10px;
}

.search-input::placeholder {
	color: var(--color-text-dim);
}

.search-input:focus {
	outline: none;
	border-color: var(--color-accent);
	box-shadow: 0 0 0 3px rgba(145, 70, 255, 0.18);
}

.results-inner {
	display: flex;
	flex-direction: column;
}

.empty-search {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 180px;
	text-align: center;
	color: var(--color-text-muted);
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
	color: var(--color-text-dim);
}
</style>
