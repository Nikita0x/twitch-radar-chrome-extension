<template>
	<div class="streamer-card">
		<div class="card-header">
			<div class="avatar-wrap">
				<img
					:src="props.streamer.profile_image_url"
					:alt="props.streamer.display_name"
					class="avatar"
					width="60"
					height="60"
				/>
				<span v-if="props.isLive" class="live-badge">LIVE</span>
			</div>
			<div class="header-info">
				<h3 class="display-name">{{ props.streamer.display_name }}</h3>
				<span class="login">@{{ props.streamer.login }}</span>
				<div class="badges">
					<span v-if="props.streamer.broadcaster_type === 'partner'" class="badge partner"
						>Partner</span
					>
					<span v-else-if="props.streamer.broadcaster_type === 'affiliate'" class="badge affiliate"
						>Affiliate</span
					>
				</div>
			</div>
			<button
				class="notif-toggle"
				:class="{ active: notificationsEnabled }"
				@click="emit('toggleNotifications', props.streamer.id)"
				:title="notificationsEnabled ? 'Disable notifications' : 'Enable notifications'"
			>
				<img
					:src="notificationsEnabled ? 'notifications-on.svg' : 'notifications-off.svg'"
					width="16"
					height="16"
				/>
			</button>
		</div>
		<p v-if="props.streamer.description" class="description">{{ props.streamer.description }}</p>
		<p v-else class="description empty">No description</p>
		<div class="card-footer">
			<span class="created">Joined {{ formatDate(props.streamer.created_at) }}</span>
			<a
				:href="`https://twitch.tv/${props.streamer.login}`"
				target="_blank"
				rel="noopener noreferrer"
				class="profile-link"
			>
				Open channel →
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { StreamersDetails } from '@/stores/twitch.ts'

const props = defineProps<{
	streamer: StreamersDetails
	isLive: boolean
	notificationsEnabled: boolean
}>()

const emit = defineEmits<{
	toggleNotifications: [streamerId: string]
}>()

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.streamer-card {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 5px;
	border-bottom: 1px solid #f0f0f0;
	transition: background 0.2s ease;
}

.streamer-card:hover {
	background: #faf5ff;
}

.card-header {
	display: flex;
	gap: 12px;
	align-items: center;
}

.avatar-wrap {
	position: relative;
	flex-shrink: 0;
}

.avatar {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	object-fit: cover;
	display: block;
	background: #eee;
}

.live-badge {
	position: absolute;
	bottom: -2px;
	left: 50%;
	transform: translateX(-50%);
	background: #eb0400;
	color: white;
	font-size: 10px;
	font-weight: 700;
	line-height: 1;
	padding: 2px 6px;
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
	font-size: 16px;
	font-weight: 700;
	color: #222;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.login {
	font-size: 12px;
	color: #888;
}

.badges {
	display: flex;
	gap: 6px;
	align-items: center;
	margin-top: 2px;
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
	background: #9146ff;
	color: white;
}

.badge.affiliate {
	background: #e5dbff;
	color: #6b3fa0;
}

.view-count {
	font-size: 11px;
	color: #666;
}

.description {
	margin: 0;
	font-size: 13px;
	line-height: 1.4;
	color: #444;
	overflow: hidden;
	/* display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	line-clamp: 3; */
}

.description.empty {
	color: #aaa;
	font-style: italic;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.created {
	font-size: 11px;
	color: #999;
}

.profile-link {
	font-size: 12px;
	font-weight: 600;
	color: #9146ff;
	text-decoration: none;
	transition: color 0.2s;
}

.profile-link:hover {
	color: #772ce8;
	text-decoration: underline;
}

.notif-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	margin-left: auto;
	flex-shrink: 0;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
}

.notif-toggle:hover {
	background: #f3f0ff;
	border-color: #9146ff;
}

.notif-toggle.active {
	background: #f3f0ff;
	border-color: #9146ff;
}
</style>
