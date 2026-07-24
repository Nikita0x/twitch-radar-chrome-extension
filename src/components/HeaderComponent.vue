<template>
	<div class="header">
		<div class="title">
			<button
				v-if="activeScreen === 'settings'"
				class="icon-btn back-btn"
				@click="activeScreen = 'favorites'"
				title="Back"
			>
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 200 200"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"
					/>
				</svg>
			</button>
			<button
				v-else-if="activeScreen === 'streamer-settings'"
				class="icon-btn back-btn"
				@click="activeScreen = 'settings'"
				title="Back"
			>
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 200 200"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"
					/>
				</svg>
			</button>
			<span v-else class="brand">Twitch Radar</span>
		</div>
		<div class="buttons">
			<!-- <button class="icon-btn heart-btn" title="Favorites"><img src="/heart.svg" width="20" height="20"
                    class="heart-icon" /></button> -->
			<button
				v-if="isAuthenticated && activeScreen === 'favorites'"
				class="icon-btn cog-btn"
				title="Settings"
				@click="activeScreen = 'settings'"
			>
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 16 16"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					class="cog-icon"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M6.50001 0H9.50001L10.0939 2.37548C10.7276 2.6115 11.3107 2.95155 11.8223 3.37488L14.1782 2.70096L15.6782 5.29904L13.9173 7.00166C13.9717 7.32634 14 7.65987 14 8C14 8.34013 13.9717 8.67366 13.9173 8.99834L15.6782 10.701L14.1782 13.299L11.8223 12.6251C11.3107 13.0484 10.7276 13.3885 10.0939 13.6245L9.50001 16H6.50001L5.90614 13.6245C5.27242 13.3885 4.68934 13.0484 4.17768 12.6251L1.82181 13.299L0.321808 10.701L2.08269 8.99834C2.02831 8.67366 2.00001 8.34013 2.00001 8C2.00001 7.65987 2.02831 7.32634 2.08269 7.00166L0.321808 5.29904L1.82181 2.70096L4.17768 3.37488C4.68934 2.95155 5.27241 2.6115 5.90614 2.37548L6.50001 0ZM8.00001 10C9.10458 10 10 9.10457 10 8C10 6.89543 9.10458 6 8.00001 6C6.89544 6 6.00001 6.89543 6.00001 8C6.00001 9.10457 6.89544 10 8.00001 10Z"
						fill="currentColor"
					/>
				</svg>
			</button>

			<div v-else-if="isAuthenticated" style="display: flex; align-items: center; gap: 10px">
				<button @click="logout" class="logout-btn">Logout</button>

				<img
					:src="twitchUser?.profile_image_url"
					style="width: 20px; height: 20px; border-radius: 50%"
				/>
				<span class="user-name">{{ twitchUser?.display_name }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTwitchStore } from '@/stores/twitch.store';
import { useNavigationStore } from '@/stores/navigation.store';
import { storeToRefs } from 'pinia';

const twitchStore = useTwitchStore();
const navigationStore = useNavigationStore();
const { twitchUser, isAuthenticated } = storeToRefs(twitchStore);
const { activeScreen } = storeToRefs(navigationStore);
const props = defineProps();

async function logout() {
	await twitchStore.logout();
	activeScreen.value = 'favorites';
}
</script>

<style scoped>
.header {
	background-color: var(--color-header-bg);
	min-height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 5px;
}

.title {
	display: flex;
	align-items: center;
	color: var(--color-header-text);
}

.brand {
	font-weight: bold;
	font-size: 15px;
}

.buttons {
	display: flex;
	gap: 6px;
	align-items: center;
}

.icon-btn {
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	font-size: 18px;
	transition: background 0.15s ease;
	color: var(--color-header-text);
}

.icon-btn:hover {
	background: rgba(0, 0, 0, 0.1);
}

/* Cog spin animation */
@keyframes cog-spin {
	to {
		transform: rotate(360deg);
	}
}

.cog-icon,
.heart-icon {
	display: block;
	transition: transform 0.3s ease;
	color: var(--color-header-text);
}

.cog-btn:hover .cog-icon {
	transform: rotate(90deg);
}

.heart-btn:hover .heart-icon {
	transform: scale(1.1);
}

.user-avatar {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	flex-shrink: 0;
}

.logout-btn {
	background-color: var(--color-red);
	color: white;
	border: none;
	padding: 5px 10px;
	border-radius: 4px;
	cursor: pointer;

	transition: 0.3s ease all;
}

.logout-btn:hover {
	filter: brightness(1.2);
}

.user-name {
	color: var(--color-header-text);
}
</style>
