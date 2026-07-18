<template>
	<div class="header">
		<div class="title">
			<button
				v-if="activeTab === 'settings'"
				class="icon-btn back-btn"
				@click="activeTab = 'favorites'"
				title="Back"
			>
				<img src="../../public/arrow.svg" style="width: 20px; height: 20px" />
			</button>
			<span v-else class="brand">Twitch Radar</span>
		</div>
		<div class="buttons">
			<!-- <button class="icon-btn heart-btn" title="Favorites"><img src="/heart.svg" width="20" height="20"
                    class="heart-icon" /></button> -->
			<button
				v-if="activeTab === 'favorites'"
				class="icon-btn cog-btn"
				title="Settings"
				@click="activeTab = 'settings'"
			>
				<img src="/cog.svg" width="20" height="20" class="cog-icon" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Tabs } from '@/App.vue'
const props = defineProps()
const activeTab = defineModel<Tabs>()
</script>

<style scoped>
.header {
	background-color: #9147ff;
	min-height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 5px;
}

.title {
	display: flex;
	align-items: center;
	color: white;
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
}

.cog-btn:hover .cog-icon {
	transform: rotate(90deg);
}

.heart-btn:hover .heart-icon {
	transform: scale(1.1);
}
</style>
