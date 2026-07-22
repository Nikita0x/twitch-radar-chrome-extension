<template>
	<div class="streamer-card">
		<div class="card-header">
			<div class="avatar-wrap">
				<div v-if="!avatarLoaded" class="avatar-skeleton"></div>
				<img
					v-show="avatarLoaded"
					:src="props.streamer.profile_image_url"
					:alt="props.streamer.display_name"
					class="avatar"
					width="60"
					height="60"
					@load="avatarLoaded = true"
				/>
				<span v-if="props.isLive" class="live-badge">LIVE</span>
			</div>
			<div class="header-info">
				<h3 class="display-name">{{ props.streamer.display_name }}</h3>
				<span class="login">@{{ props.streamer.login }}</span>
				<div class="badges">
					<span
						v-if="props.streamer.broadcaster_type === 'partner'"
						class="badge partner"
						title="Top creators with additional features and benefits."
						>Partner</span
					>
					<span
						v-else-if="props.streamer.broadcaster_type === 'affiliate'"
						class="badge affiliate"
						title="Can earn revenue through subscriptions, Bits, and ads."
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
				<svg
					v-if="notificationsEnabled"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					class="notif-icon"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M11.5 0.999992C10.9477 0.999992 10.5 1.44771 10.5 1.99999V2.99999H9.99998C7.23864 2.99999 4.99998 5.23824 4.99998 7.99975V11C4.99998 11.7377 4.76718 12.5722 4.39739 13.4148C4.03164 14.2482 3.55875 15.0294 3.14142 15.6439C2.38188 16.7624 2.85215 18.5301 4.40564 18.8103C5.42144 18.9935 6.85701 19.2115 8.54656 19.3527C8.54454 19.4015 8.54352 19.4506 8.54352 19.5C8.54352 21.433 10.1105 23 12.0435 23C13.9765 23 15.5435 21.433 15.5435 19.5C15.5435 19.4482 15.5424 19.3966 15.5402 19.3453C17.1921 19.204 18.596 18.9903 19.5943 18.8103C21.1478 18.5301 21.6181 16.7624 20.8586 15.6439C20.4412 15.0294 19.9683 14.2482 19.6026 13.4148C19.2328 12.5722 19 11.7377 19 11V7.99975C19 5.23824 16.7613 2.99999 14 2.99999H13.5V1.99999C13.5 1.44771 13.0523 0.999992 12.5 0.999992H11.5ZM12 19.5C12.5113 19.5 13.0122 19.4898 13.4997 19.4715C13.5076 20.2758 12.8541 20.9565 12.0435 20.9565C11.2347 20.9565 10.5803 20.2778 10.5872 19.4746C11.0473 19.491 11.5191 19.5 12 19.5ZM9.99998 4.99999C8.34305 4.99999 6.99998 6.34297 6.99998 7.99975V11C6.99998 12.1234 6.65547 13.2463 6.22878 14.2186C5.79804 15.2 5.25528 16.0911 4.79599 16.7675C4.78578 16.7825 4.78102 16.7969 4.77941 16.8113C4.77797 16.8242 4.77919 16.8362 4.78167 16.8458C6.3644 17.1303 9.00044 17.5 12 17.5C14.9995 17.5 17.6356 17.1303 19.2183 16.8458C19.2208 16.8362 19.222 16.8242 19.2206 16.8113C19.2189 16.7969 19.2142 16.7825 19.204 16.7675C18.7447 16.0911 18.2019 15.2 17.7712 14.2186C17.3445 13.2463 17 12.1234 17 11V7.99975C17 6.34297 15.6569 4.99999 14 4.99999H9.99998Z"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M16.0299 0.757457C16.1622 0.228068 16.7146 -0.102469 17.2437 0.0301341C17.3131 0.0476089 17.3789 0.0669732 17.4916 0.104886C17.6295 0.151258 17.8183 0.221479 18.0424 0.322098C18.4894 0.522794 19.0851 0.848127 19.6982 1.35306C20.9431 2.37831 22.2161 4.1113 22.495 6.9005C22.55 7.45005 22.149 7.94009 21.5995 7.99504C21.05 8.05 20.5599 7.64905 20.505 7.09951C20.2839 4.88869 19.3068 3.62168 18.4268 2.89692C17.9774 2.52686 17.5418 2.28969 17.2232 2.14664C17.0645 2.07538 16.9369 2.02841 16.8541 2.00057C16.8201 1.98913 16.7859 1.97833 16.7513 1.96858C16.2192 1.83203 15.8964 1.2912 16.0299 0.757457Z"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M7.97014 0.757457C7.83619 0.221662 7.29326 -0.104099 6.75746 0.0298498C6.68765 0.0473468 6.62176 0.066766 6.5084 0.104885C6.37051 0.151257 6.1817 0.221478 5.9576 0.322097C5.51059 0.522793 4.91493 0.848125 4.30179 1.35306C3.05685 2.37831 1.78388 4.1113 1.50496 6.90049C1.45001 7.45003 1.85095 7.94008 2.40049 7.99503C2.95004 8.04998 3.44008 7.64904 3.49504 7.0995C3.71612 4.88869 4.69315 3.62168 5.57321 2.89692C6.02257 2.52686 6.45815 2.28969 6.77678 2.14664C6.93548 2.07538 7.06308 2.02841 7.14589 2.00057C7.17991 1.98913 7.21413 1.97833 7.24867 1.96858C7.78081 1.83203 8.10358 1.2912 7.97014 0.757457Z"
					/>
				</svg>
				<svg
					v-else
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					class="notif-icon"
				>
					<path
						d="M10.5 2C10.5 1.44772 10.9477 1 11.5 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3H14C16.7613 3 19 5.23825 19 7.99975V11C19 11.7377 19.2328 12.5722 19.6026 13.4148C19.9683 14.2482 20.4412 15.0294 20.8586 15.6439C21.3162 16.3178 21.3274 17.2273 20.9242 17.9052L18.2876 15.2685C18.1067 14.9353 17.9312 14.5831 17.7712 14.2186C17.3445 13.2463 17 12.1234 17 11V7.99975C17 6.34298 15.6569 5 14 5H9.99999C9.43275 5 8.9023 5.15739 8.44992 5.43089L7.01062 3.99158C7.84446 3.36876 8.87917 3 9.99999 3H10.5V2Z"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5.00027 7.94565C5.00008 7.96366 4.99999 7.98169 4.99999 7.99975V11C4.99999 11.7377 4.76718 12.5722 4.39739 13.4148C4.03165 14.2482 3.55876 15.0294 3.14142 15.6439C2.38188 16.7624 2.85216 18.5301 4.40564 18.8103C5.42144 18.9935 6.85701 19.2115 8.54657 19.3527C8.54454 19.4015 8.54352 19.4506 8.54352 19.5C8.54352 21.433 10.1105 23 12.0435 23C13.9765 23 15.5435 21.433 15.5435 19.5C15.5435 19.4482 15.5424 19.3966 15.5402 19.3453C15.8088 19.3224 16.0709 19.2975 16.3257 19.2711L14.4742 17.4196C13.6902 17.4696 12.86 17.5 12 17.5C9.00044 17.5 6.36441 17.1303 4.78167 16.8458C4.7792 16.8362 4.77797 16.8242 4.77941 16.8113C4.78102 16.7969 4.78578 16.7825 4.79599 16.7675C5.25529 16.0911 5.79804 15.2 6.22878 14.2186C6.65547 13.2463 6.99999 12.1234 6.99999 11V9.94536L5.00027 7.94565ZM13.4997 19.4715C13.0122 19.4898 12.5113 19.5 12 19.5C11.5191 19.5 11.0473 19.491 10.5872 19.4747C10.5803 20.2778 11.2347 20.9565 12.0435 20.9565C12.8541 20.9565 13.5076 20.2758 13.4997 19.4715Z"
					/>
					<path
						d="M2.00789 3.42206C1.61737 3.03153 1.61737 2.39837 2.00789 2.00784C2.39841 1.61732 3.03158 1.61732 3.4221 2.00784L22.0004 20.5862C22.391 20.9767 22.391 21.6099 22.0004 22.0004C21.6099 22.3909 20.9767 22.3909 20.5862 22.0004L2.00789 3.42206Z"
					/>
				</svg>
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
				Open channel
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { StreamersDetails } from '@/stores/twitch.ts';

const props = defineProps<{
	streamer: StreamersDetails;
	isLive: boolean;
	notificationsEnabled: boolean;
}>();

const avatarLoaded = ref(false);

const emit = defineEmits<{
	toggleNotifications: [streamerId: string];
}>();

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.streamer-card {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 5px;
	border-bottom: 1px solid var(--color-border-default);
	transition: background 0.2s ease;
}

.streamer-card:hover {
	background: var(--color-bg-secondary);
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
	display: block;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	object-fit: cover;
}

.avatar-skeleton {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: linear-gradient(
		90deg,
		var(--color-bg-skeleton) 25%,
		var(--color-bg-skeleton-shine) 50%,
		var(--color-bg-skeleton) 75%
	);
	background-size: 200% 100%;
	animation: skeleton-loading 1.2s infinite;
}

@keyframes skeleton-loading {
	from {
		background-position: 200% 0;
	}
	to {
		background-position: -200% 0;
	}
}

.live-badge {
	position: absolute;
	bottom: -2px;
	left: 50%;
	transform: translateX(-50%);
	background: var(--color-red);
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
	color: var(--color-text-primary);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.login {
	font-size: 12px;
	color: var(--color-text-dim);
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
	background: var(--color-badge-partner-bg);
	color: var(--color-badge-partner-text);
}

.badge.affiliate {
	background: var(--color-badge-affiliate-bg);
	color: var(--color-badge-affiliate-text);
}

.description {
	margin: 0;
	font-size: 13px;
	line-height: 1.4;
	color: var(--color-text-description);
	overflow: hidden;
}

.description.empty {
	color: var(--color-text-desc-empty);
	font-style: italic;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.created {
	font-size: 11px;
	color: var(--color-text-desc-muted);
}

.profile-link {
	font-size: 12px;
	font-weight: 600;
	color: var(--color-accent);
	text-decoration: none;
	transition: color 0.2s;
}

.profile-link:hover {
	color: var(--color-accent-hover);
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
	border: 1px solid var(--color-border-notif);
	border-radius: 8px;
	background: var(--color-bg-notif-toggle);
	cursor: pointer;
	transition: all 0.2s ease;
}

.notif-toggle:hover {
	background: var(--color-bg-toggle-hover);
	border-color: var(--color-border-notif-active);
}

.notif-toggle.active {
	background: var(--color-bg-toggle-hover);
	border-color: var(--color-border-notif-active);
}

.notif-icon {
	color: var(--color-notif-icon);
}
</style>
