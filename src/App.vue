<template>
    <div class="extension-shell">
        <HeaderComponent :settings-open="activeTab === 'settings'" @open-settings="activeTab = 'settings'"
            @close-settings="activeTab = 'favorites'" />
        <FavoritesTab v-if="activeTab === 'favorites'" />
        <SettingsTab v-else />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SettingsTab from './components/SettingsTab.vue'
import FavoritesTab from './components/FavoritesTab.vue'
import { useTwitchStore } from '@/stores/twitch'

const twitchStore = useTwitchStore()

const activeTab = ref('favorites')

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
</style>
