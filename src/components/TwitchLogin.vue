<template>
    <div class="twitch-auth">
        <div v-if="twitchUser">
            <img :src="twitchUser.profile_image_url" class="avatar" />
            <p>Привет, {{ twitchUser.display_name }}!</p>
            <button @click="logout" class="logout-btn">Выйти</button>
        </div>
        <button v-else @click="loginWithTwitch" class="login-btn">
            Войти через Twitch
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const CLIENT_ID = 'cvem7bputjzs04pdh02g96bqb4wrj9'
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`

interface TwitchUser {
    display_name: string
    profile_image_url: string
}

const twitchUser = ref<TwitchUser | null>(null)
const accessToken = ref<string | null>(null)

// 1. Функция запуска авторизации
function loginWithTwitch() {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&response_type=token&scope=user:read:email`

    chrome.identity.launchWebAuthFlow(
        {
            url: authUrl,
            interactive: true
        },
        (redirectUrl) => {
            if (chrome.runtime.lastError || !redirectUrl) {
                console.error('Ошибка авторизации:', chrome.runtime.lastError)
                return
            }

            // Извлекаем access_token из URL редиректа
            const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1))
            const token = urlParams.get('access_token')

            if (token) {
                accessToken.value = token
                // Сохраняем токен локально
                chrome.storage.local.set({ twitch_token: token }, () => {
                    fetchTwitchUserData(token)
                })
            }
        }
    )
}

// 2. Получение данных пользователя с Twitch API
async function fetchTwitchUserData(token: string) {
    try {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        if (data.data && data.data[0]) {
            twitchUser.value = data.data[0]
        }
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err)
    }
}

// 3. Проверка токена при запуске попапа
onMounted(() => {
    chrome.storage.local.get(['twitch_token'], (result) => {
        if (result.twitch_token) {
            accessToken.value = result.twitch_token
            fetchTwitchUserData(result.twitch_token)
        }
    })
})

// 4. Выход из аккаунта
function logout() {
    chrome.storage.local.remove(['twitch_token'], () => {
        twitchUser.value = null
        accessToken.value = null
    })
}
</script>

<style scoped>
.twitch-auth {
    margin: 15px 0;
    text-align: center;
}

.login-btn {
    background-color: #9146ff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.login-btn:hover {
    background-color: #772ce8;
}

.logout-btn {
    background-color: #ff4757;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 5px;
}
</style>