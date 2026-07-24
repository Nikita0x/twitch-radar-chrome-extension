<template>
	<div class="streamer-settings">
		<div v-if="selectedStreamer" class="settings-content">
			<!-- Streamer header -->
			<div class="streamer-header">
				<div class="avatar-wrap">
					<img
						:src="selectedStreamer.profile_image_url"
						:alt="selectedStreamer.display_name"
						class="avatar"
						width="72"
						height="72"
					/>
					<span v-if="isLive" class="live-badge">LIVE</span>
				</div>
				<div class="header-info">
					<h2 class="display-name">{{ selectedStreamer.display_name }}</h2>
					<span class="login">@{{ selectedStreamer.login }}</span>
					<p class="login">{{ selectedStreamer.description }}</p>
					<p class="login">Joined {{ formatDate(selectedStreamer.created_at) }}</p>
					<div class="badges">
						<span v-if="selectedStreamer.broadcaster_type === 'partner'" class="badge partner"
							>Partner</span
						>
						<span
							v-else-if="selectedStreamer.broadcaster_type === 'affiliate'"
							class="badge affiliate"
							>Affiliate</span
						>
					</div>
				</div>
			</div>

			<!-- Notification settings -->
			<div class="settings-section">
				<h3 class="section-title">Notification Settings</h3>

				<div class="toggle-row">
					<div class="toggle-info">
						<span class="toggle-label">Notify when goes live</span>
						<span class="toggle-desc">Get notified when the streamer starts streaming.</span>
					</div>
					<label class="switch">
						<input
							type="checkbox"
							:checked="streamerNotifications?.live.enabled"
							@change="handleToggleLiveNotification"
						/>
						<span class="slider"></span>
					</label>
				</div>

				<div class="toggle-row">
					<div class="toggle-info">
						<span class="toggle-label">Notify on title change</span>
						<span class="toggle-desc"
							>Get notified when the streamer changes the stream title.</span
						>
					</div>
					<label class="switch">
						<input
							type="checkbox"
							:checked="streamerNotifications?.titleChange.enabled"
							@change="handleToggleTitleChangeNotification"
						/>
						<span class="slider"></span>
					</label>
				</div>

				<div class="toggle-row">
					<div class="toggle-info">
						<span class="toggle-label">Auto-open new tab</span>
						<span class="toggle-desc">Automatically open browser tab when streamer goes live.</span>
					</div>
					<label class="switch">
						<input
							type="checkbox"
							:checked="streamerNotifications?.live.autoOpen"
							@change="handleToggleAutoOpenNotification"
						/>
						<span class="slider"></span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNavigationStore } from '@/stores/navigation.store';
import { useUserSettingsStore } from '@/stores/user-settings.store';
import { useTwitchStore } from '@/stores/twitch.store';
import { getStreamerNotifications } from '@/services/storage.service';
import { formatDate } from '@/utils/utils';

const navigationStore = useNavigationStore();
const userSettingsStore = useUserSettingsStore();
const twitchStore = useTwitchStore();

const { selectedStreamer } = storeToRefs(navigationStore);
const { userSettingsState } = storeToRefs(userSettingsStore);
const { followedLiveStreams } = storeToRefs(twitchStore);

const isLive = computed(() => {
	if (!selectedStreamer.value) return false;
	return followedLiveStreams.value.some((s) => s.user_id === selectedStreamer.value!.id);
});

const streamerNotifications = computed(() => {
	if (!selectedStreamer.value) return null;

	return getStreamerNotifications(userSettingsState.value, selectedStreamer.value.id);
});

async function handleToggleLiveNotification() {
	if (!selectedStreamer.value || !streamerNotifications.value) return;

	streamerNotifications.value.live.enabled = !streamerNotifications.value.live.enabled;

	await userSettingsStore.updateStreamerNotifications(
		selectedStreamer.value.id,
		streamerNotifications.value
	);
}

async function handleToggleTitleChangeNotification() {
	if (!selectedStreamer.value || !streamerNotifications.value) return;

	streamerNotifications.value.titleChange.enabled =
		!streamerNotifications.value.titleChange.enabled;

	await userSettingsStore.updateStreamerNotifications(
		selectedStreamer.value.id,
		streamerNotifications.value
	);
}

async function handleToggleAutoOpenNotification() {
	if (!selectedStreamer.value || !streamerNotifications.value) return;

	streamerNotifications.value.live.autoOpen = !streamerNotifications.value.live.autoOpen;

	await userSettingsStore.updateStreamerNotifications(
		selectedStreamer.value.id,
		streamerNotifications.value
	);
}
</script>

<style scoped>
.streamer-settings {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.back-btn {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 12px;
	margin: 4px;
	border: none;
	background: transparent;
	color: var(--color-accent);
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	border-radius: 8px;
	transition: background 0.2s;
	width: fit-content;
}

.back-btn:hover {
	background: var(--color-bg-secondary);
}

.settings-content {
	padding: 8px 16px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

/* ── Streamer header ── */
.streamer-header {
	display: flex;
	align-items: center;
	gap: 16px;
	padding-bottom: 16px;
	border-bottom: 1px solid var(--color-border);
}

.avatar-wrap {
	position: relative;
	flex-shrink: 0;
}

.avatar {
	width: 72px;
	height: 72px;
	border-radius: 50%;
	object-fit: cover;
}

.live-badge {
	position: absolute;
	bottom: -2px;
	left: 50%;
	transform: translateX(-50%);
	background: var(--color-red);
	color: white;
	font-size: 11px;
	font-weight: 700;
	line-height: 1;
	padding: 2px 8px;
	border-radius: 4px;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	white-space: nowrap;
}

.header-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.display-name {
	margin: 0;
	font-size: 20px;
	font-weight: 700;
	color: var(--color-text);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.login {
	font-size: 13px;
	color: var(--color-text-dim);
}

.badges {
	display: flex;
	gap: 6px;
	align-items: center;
	margin-top: 4px;
	flex-wrap: wrap;
}

.badge {
	font-size: 10px;
	font-weight: 700;
	padding: 2px 6px;
	border-radius: 4px;
	text-transform: uppercase;
}

.badge.partner {
	background: var(--color-accent);
	color: white;
}

.badge.affiliate {
	background: var(--color-bg-secondary);
	color: var(--color-accent);
}

/* ── Settings section ── */
.settings-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.section-title {
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	color: var(--color-text-muted);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

/* ── Toggle rows ── */
.toggle-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background: var(--color-bg-secondary);
	border-radius: 10px;
	gap: 12px;
}

.toggle-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.toggle-label {
	font-size: 14px;
	font-weight: 600;
	color: var(--color-text);
}

.toggle-desc {
	font-size: 12px;
	color: var(--color-text-dim);
}

/* ── Toggle switch ── */
.switch {
	position: relative;
	display: inline-block;
	width: 44px;
	height: 24px;
	flex-shrink: 0;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	inset: 0;
	background-color: var(--color-border);
	transition: 0.3s;
	border-radius: 24px;
}

.slider::before {
	content: '';
	position: absolute;
	height: 18px;
	width: 18px;
	left: 3px;
	bottom: 3px;
	background-color: white;
	transition: 0.3s;
	border-radius: 50%;
}

input:checked + .slider {
	background-color: var(--color-accent);
}

input:checked + .slider::before {
	transform: translateX(20px);
}
</style>
