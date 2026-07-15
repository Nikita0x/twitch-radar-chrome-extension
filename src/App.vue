<template>
	<div class="extension-shell">
		<h1 @click="console.log(accessToken)">Log access token.</h1>
		<h1 @click="console.log(twitchUser)">Log Twitch User.</h1>
		<h1 @click="console.log(followedStreams)">Log Followed Streams.</h1>
		<Tabs v-model="activeTab" :tabs="tabs">
			<template #favorites>
				<TwitchApiButtons />
			</template>
			<template #settings>
				<TwitchLogin />
			</template>
		</Tabs>
		<NotificationButton />
		<VueButton />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NotificationButton from './components/NotificationButton.vue'
import TwitchLogin from './components/TwitchLogin.vue'
import TwitchApiButtons from './components/TwitchApiButtons.vue'
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
	width: 500px;
	height: 560px;
	padding: 12px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
