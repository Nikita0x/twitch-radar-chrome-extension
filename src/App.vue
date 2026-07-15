<template>
	<div class="extension-shell">
		<Tabs v-model="activeTab" :tabs="tabs">
			<template #favorites>
				<TwitchApiButtons />
			</template>
			<template #settings>
				<TwitchLogin @token-changed="onTokenChanged" />
			</template>
		</Tabs>
		<NotificationButton />
		<VueButton />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueButton from './components/VueButton.vue'
import NotificationButton from './components/NotificationButton.vue'
import TwitchLogin from './components/TwitchLogin.vue'
import TwitchApiButtons from './components/TwitchApiButtons.vue'
import Tabs from './components/Tabs.vue'
import { useTwitchStore } from '@/stores/twitch'

const twitchStore = useTwitchStore()
const activeTab = ref('favorites')
const tabs = [
	{ id: 'favorites', label: 'Favorites' },
	{ id: 'settings', label: 'Settings' },
]

function onTokenChanged() {
	void twitchStore.init()
}
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
