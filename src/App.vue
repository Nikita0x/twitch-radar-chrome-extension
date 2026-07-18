<template>
	<div class="extension-shell">
		<HeaderComponent style="margin-bottom: 10px" v-model="activeTab" />
		<div
			v-if="isAuthenticated && activeTab === 'favorites'"
			style="display: flex; padding-inline: 5px"
			class="toolbar"
		>
			<input class="search-input" placeholder="Streamer name..." v-model="search" />
			<div>
				<select class="sort-select" name="sort" id="pet-select" v-model="sort">
					<option value="viewers:highToLow">Viewers: High to Low</option>
					<option value="viewers:lowToHigh">Viewers: Low to High</option>
					<option value="duration:longest">Duration: Longest</option>
					<option value="duration:shortest">Duration: Shortest</option>
				</select>
			</div>
		</div>
		<FavoritesTab v-if="activeTab === 'favorites'" :sort :search />
		<SettingsTab v-else />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SettingsTab from './components/SettingsTab.vue'
import FavoritesTab from './components/FavoritesTab.vue'
import { useTwitchStore } from '@/stores/twitch'
import { storeToRefs } from 'pinia'

const twitchStore = useTwitchStore()
const { followedStreams, isAuthenticated } = storeToRefs(twitchStore)

export type Sort = Viewers | StreamDuration
type Viewers = 'viewers:highToLow' | 'viewers:lowToHigh'
type StreamDuration = 'duration:longest' | 'duration:shortest'

export type Tabs = 'favorites' | 'settings'

const activeTab = ref<Tabs>('favorites')
const sort = ref<Sort>('viewers:highToLow')
const search = ref('')

onMounted(async () => {
	await twitchStore.init()
})
</script>

<style scoped>
.extension-shell {
	width: 500px;
	height: 560px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.toolbar {
	display: flex;
	gap: 5px;
	align-items: center;
}

.search-input,
.sort-select {
	height: 38px;

	border: 1px solid #3d3d44;
	border-radius: 8px;

	font-size: 13px;

	transition:
		border-color 0.2s,
		box-shadow 0.2s,
		background 0.2s;
}

.search-input {
	flex: 1;
	padding: 0 5px;
}

.search-input::placeholder {
	color: #9b9b9b;
}

.search-input:focus,
.sort-select:focus {
	outline: none;

	border-color: #9146ff;

	box-shadow: 0 0 0 3px rgba(145, 70, 255, 0.18);
}

.sort-select {
	min-width: 180px;

	cursor: pointer;
}
</style>
