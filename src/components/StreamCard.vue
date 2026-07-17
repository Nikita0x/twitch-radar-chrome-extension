<template>
    <a :href="`https://twitch.com/${props.stream.user_login}`" target="_blank" rel="noopener noreferrer" class="card"
        :title="props.stream.title">
        <div class="thumb-wrap">
            <img :src="props.stream.thumbnail_url.replace('{width}', '200').replace('{height}', '100')" class="thumb"
                width="200" height="100" />
            <div class="thumb-overlay">
                <span class="thumb-user">{{ props.stream.user_name }}</span>
            </div>
        </div>
        <div class="card-info">
            <div>
                <p class="card-name">{{ props.stream.title }}</p>
                <p class="card-game">{{ props.stream.game_name || '—' }}</p>
            </div>
            <div class="meta-row">
                <div style="display: flex; align-items: center; gap: 5px">
                    <span class="live"></span>
                    <span class="viewer-count">{{ props.stream.viewer_count }}</span>
                </div>

                <span class="uptime"><span style="transform: translateY(1px); display: inline-block">🕒</span>{{
                    formatUptime(props.stream.started_at) }}</span>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
import type { FollowData } from '@/stores/twitch'
import { formatUptime } from '@/utils/utils'

const props = defineProps<{
    stream: FollowData
}>()
</script>

<style scoped>
.card {
    display: flex;

    gap: 10px;
    border-bottom: 1px solid #f0f0f0;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    padding-left: 5px;
    padding-right: 10px;
    padding-block: 6px;
    transition: all 0.2s ease;
}

.card:hover {
    background: #c4b5fd;

    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(145, 70, 255, 0.12);
}

.card:last-child {
    border-bottom: none;
}

.thumb-wrap {
    position: relative;
    flex-shrink: 0;
    /* border-radius: 8px; */
    overflow: hidden;
}

.thumb {
    display: block;
    width: 200px;
    height: 100px;
    object-fit: cover;
    background: #eee;
}

.thumb-overlay {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 7px 9px;
    box-sizing: border-box;

    background-color: black;
}

.thumb-user {
    color: yellow;
    /* color: white; */
    font-size: 15px;
    /* font-weight: 700; */
    letter-spacing: 0.02em;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.card-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
    flex: 1;
}

.card-name {
    font-weight: bold;
    color: #222;
    overflow: hidden;
    font-size: 15px;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
}

.card-game {
    color: #404040;
    font-size: 14px;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    justify-content: space-between;
}

.live {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: #eb0400;
}

.viewer-count {
    font-weight: 700;
    color: #eb0400;
}

.uptime {
    display: flex;
    align-items: center;
    /* gap: 5px; */
    color: black;
}
</style>
