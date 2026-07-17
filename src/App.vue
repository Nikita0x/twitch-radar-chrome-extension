<template>
	<div class="extension-shell">
		<!-- <p>
			isAuthenticated?:
			<span :style="isAuthenticated ? 'color: green;' : 'color: red;'">{{ isAuthenticated }}</span>
		</p> -->
		<!-- <p @click="console.log(accessToken)">Log access token.</p> -->
		<!-- <p @click="console.log(twitchUser)">Log Twitch User.</p> -->
		<p @click="console.log(followedStreams)">Log Followed Streams.</p>
		<HeaderComponent />
		<Tabs v-model="activeTab" :tabs="tabs">
			<template #favorites>
				<FavoritesTab />
			</template>
			<template #settings>
				<SettingsTab />
			</template>
		</Tabs>
		<!-- <NotificationButton /> -->
		<!-- <VueButton /> -->
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NotificationButton from './components/NotificationButton.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SettingsTab from './components/SettingsTab.vue'
import FavoritesTab from './components/FavoritesTab.vue'
import Tabs from './components/Tabs.vue'
import { useTwitchStore } from '@/stores/twitch'
import { storeToRefs } from 'pinia'

const twitchStore = useTwitchStore()
const { accessToken, twitchUser, followedStreams, isAuthenticated } = storeToRefs(twitchStore)

const activeTab = ref('favorites')
const tabs = [
	{ id: 'favorites', label: 'Favorites' },
	{ id: 'settings', label: 'Settings' },
]

onMounted(async () => {
	await twitchStore.init()
})
</script>

<style scoped>
.extension-shell {
	/* background-color: #0e0e10; */
	width: 500px;
	height: 560px;
	/* padding: 12px; */
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
