import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

interface TwitchUser {
	id: string
	display_name: string
	profile_image_url: string
	email?: string
	description?: string
	broadcaster_type?: string
	created_at?: string
	offline_image_url?: string
	view_count?: number
	type?: string
}

interface FollowedChannel {
	id: string
	display_name: string
	game_name?: string
	is_live: boolean
	thumbnail_url: string
	viewer_count: number
	uptime: string
	stream_url: string
}

const CLIENT_ID = 'cvem7bputjzs04pdh02g96bqb4wrj9'
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`

function getLastError(): { message: string } | undefined {
	return (chrome.runtime as { lastError?: { message: string } }).lastError
}

function launchAuthFlow(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		chrome.identity.launchWebAuthFlow({ url, interactive: true }, (redirectUrl) => {
			const lastErr = getLastError()
			if (lastErr) {
				reject(new Error(lastErr.message))
				return
			}
			if (!redirectUrl) {
				reject(new Error('Auth flow returned empty redirect URL'))
				return
			}
			resolve(redirectUrl)
		})
	})
}

function extractTokenFromUrl(url: string): string | null {
	try {
		const hash = new URL(url).hash.substring(1)
		const params = new URLSearchParams(hash)
		return params.get('access_token')
	} catch {
		return null
	}
}

function formatUptime(startedAt: string): string {
	const started = new Date(startedAt)
	const now = new Date()
	const diffMs = Math.max(0, now.getTime() - started.getTime())
	const hours = Math.floor(diffMs / (1000 * 60 * 60))
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

	if (hours > 0) {
		return `${hours}ч ${minutes}м`
	}
	return `${minutes}м`
}

export const useTwitchStore = defineStore('twitch', () => {
	const accessToken = ref<string | null>(null)
	const twitchUser = ref<TwitchUser | null>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)
	const followedStreams = ref<FollowedChannel[]>([])
	const isAuthenticated = computed(() => !!accessToken.value)

	function clearError() {
		error.value = null
	}

	async function fetchUserProfile(token: string) {
		loading.value = true
		try {
			const response = await fetch('https://api.twitch.tv/helix/users', {
				headers: {
					'Client-ID': CLIENT_ID,
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				if (response.status === 401) {
					await chrome.storage.local.remove(['twitch_token'])
					accessToken.value = null
					followedStreams.value = []
					twitchUser.value = null
					throw new Error('Токен доступа истёк, выполните повторную авторизацию')
				}
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const data = await response.json()
			if (data.data?.[0]) {
				twitchUser.value = data.data[0]
				return data.data[0]
			}

			throw new Error('Пользователь не найден')
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			error.value = message
			twitchUser.value = null
			throw err
		} finally {
			loading.value = false
		}
	}

	async function loadFollowedStreams(token = accessToken.value) {
		if (!token) {
			followedStreams.value = []
			return
		}

		loading.value = true
		error.value = null
		followedStreams.value = []
		try {
			const response = await fetch('https://api.twitch.tv/helix/users', {
				headers: {
					'Client-ID': CLIENT_ID,
					Authorization: `Bearer ${token}`,
				},
			})
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}
			const userData = await response.json()
			const userId = userData.data?.[0]?.id
			if (!userId) {
				throw new Error('Не удалось получить данные пользователя')
			}

			let followResponse
			try {
				followResponse = await fetch(
					`https://api.twitch.tv/helix/streams/followed?user_id=${userId}&first=20`,
					{
						headers: {
							'Client-ID': CLIENT_ID,
							Authorization: `Bearer ${token}`,
						},
					}
				)
			} catch {
				followResponse = null
			}

			if (!followResponse || !followResponse.ok) {
				const followsResponse = await fetch(
					`https://api.twitch.tv/helix/users/follows?from_id=${userId}&first=20`,
					{
						headers: {
							'Client-ID': CLIENT_ID,
							Authorization: `Bearer ${token}`,
						},
					}
				)
				if (!followsResponse.ok) {
					throw new Error(`HTTP ${followsResponse.status}: ${followsResponse.statusText}`)
				}
				const followsData = await followsResponse.json()
				if (!followsData.data?.length) {
					return
				}

				const broadcasterIds = followsData.data.map((f: any) => f.to_id).join('&user_id=')
				const streamsResponse = await fetch(
					`https://api.twitch.tv/helix/streams?user_id=${broadcasterIds}&first=20`,
					{
						headers: {
							'Client-ID': CLIENT_ID,
							Authorization: `Bearer ${token}`,
						},
					}
				)
				if (!streamsResponse.ok) {
					throw new Error(`HTTP ${streamsResponse.status}: ${streamsResponse.statusText}`)
				}
				const streamsData = await streamsResponse.json()
				followedStreams.value = followsData.data
					.map((follow: any) => {
						const stream = streamsData.data?.find((item: any) => item.user_id === follow.to_id)
						if (!stream) {
							return null
						}
						return {
							id: stream.user_id,
							display_name: stream.user_name,
							game_name: stream.game_name,
							is_live: true,
							thumbnail_url:
								stream.thumbnail_url?.replace('{width}', '80').replace('{height}', '45') ||
								'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
							viewer_count: Number(stream.viewer_count ?? 0),
							uptime: formatUptime(stream.started_at),
							stream_url: `https://www.twitch.tv/${stream.user_login || stream.user_name}`,
						}
					})
					.filter((item: FollowedChannel | null): item is FollowedChannel => item !== null)
				return
			}

			const followedData = await followResponse.json()
			if (!followedData.data?.length) {
				return
			}
			followedStreams.value = followedData.data.map((stream: any) => ({
				id: stream.user_id,
				display_name: stream.user_name || stream.user_login,
				game_name: stream.game_name,
				is_live: true,
				thumbnail_url:
					stream.thumbnail_url?.replace('{width}', '80').replace('{height}', '45') ||
					'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
				viewer_count: Number(stream.viewer_count ?? 0),
				uptime: formatUptime(stream.started_at),
				stream_url: `https://www.twitch.tv/${stream.user_login || stream.user_name}`,
			}))
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			error.value = message
			followedStreams.value = []
		} finally {
			loading.value = false
		}
	}

	async function loginWithTwitch() {
		loading.value = true
		error.value = null
		try {
			const authUrl =
				`https://id.twitch.tv/oauth2/authorize` +
				`?client_id=${CLIENT_ID}` +
				`&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
				`&response_type=token` +
				`&scope=user:read:email+user:read:follows`

			const redirectUrl = await launchAuthFlow(authUrl)
			const token = extractTokenFromUrl(redirectUrl)
			if (!token) {
				throw new Error('Токен доступа не найден в URL редиректа')
			}

			accessToken.value = token
			await chrome.storage.local.set({ twitch_token: token })
			await fetchUserProfile(token)
			await loadFollowedStreams(token)
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			if (message.includes('canceled') || message.includes('cancelled')) {
				console.log('Авторизация отменена пользователем')
			} else {
				error.value = `Ошибка авторизации: ${message}`
			}
		} finally {
			loading.value = false
		}
	}

	async function logout() {
		await chrome.storage.local.remove(['twitch_token'])
		accessToken.value = null
		twitchUser.value = null
		followedStreams.value = []
		error.value = null
		loading.value = false
	}

	async function init() {
		loading.value = true
		try {
			const result = await new Promise<{ twitch_token?: string }>((resolve) => {
				chrome.storage.local.get(['twitch_token'], (stored) => resolve(stored))
			})
			if (result.twitch_token) {
				accessToken.value = result.twitch_token
				await fetchUserProfile(result.twitch_token)
				await loadFollowedStreams(result.twitch_token)
			} else {
				accessToken.value = null
				twitchUser.value = null
				followedStreams.value = []
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			error.value = message
		} finally {
			loading.value = false
		}
	}

	return {
		accessToken,
		twitchUser,
		loading,
		error,
		followedStreams,
		isAuthenticated,
		clearError,
		fetchUserProfile,
		loadFollowedStreams,
		loginWithTwitch,
		logout,
		init,
	}
})
