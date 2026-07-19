import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { formatUptime } from '@/utils/utils'
import { getStorage, saveStorage } from '@/services/storage.service'

interface TwitchUser {
	id: string
	created_at: string
	display_name: string
	description: string
	broadcaster_type: string
	profile_image_url: string
	offline_image_url: string
	type: string
	login: string
	view_count: number
}

export type FollowData = Pick<FollowResponse, 'data'>['data'][number]

interface FollowResponse {
	data: {
		game_id: string
		game_name: string
		id: string
		is_mature: boolean
		language: string
		started_at: string
		tag_ids: [] //TODO: this is always empty?
		tags: string[]
		thumbnail_url: string
		title: string
		type: string
		user_id: string
		user_login: string
		user_name: string
		viewer_count: number
	}[]
	pagination: {} //TODO: add proper type for this field
}

// interface ChromeStorage {
// 	twitch_token: string
// }

export interface StreamersDetails {
	broadcaster_type: string
	created_at: string
	description: string
	display_name: string
	id: string
	login: string
	offline_image_url: string
	profile_image_url: string
	type: string
	view_count: number
}

const CLIENT_ID = 'cvem7bputjzs04pdh02g96bqb4wrj9'
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`

async function launchAuthFlow(url: string) {
	const redirectUrl = await chrome.identity.launchWebAuthFlow({ url, interactive: true })

	if (!redirectUrl) {
		throw new Error('Авторизация была отменена или не завершилась')
	} //TODO: if the user closed the popup window, or did anything BUT authorization - will be undefined. Better to show in the UI on top of throwing error
	return redirectUrl
}

function extractTokenFromUrl(url: string) {
	try {
		const hash = new URL(url).hash.substring(1)
		const params = new URLSearchParams(hash)
		return params.get('access_token')
	} catch {
		return null
	}
}

export const useTwitchStore = defineStore('twitch', () => {
	const accessToken = ref<string | null>(null)
	const twitchUser = ref<TwitchUser | null>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)
	const followedLiveStreams = ref<FollowData[]>([])
	const followedAllStreams = ref<StreamersDetails[]>([])

	const isAuthenticated = computed(() => !!accessToken.value)
	const totalLiveStreamers = computed(() => followedLiveStreams.value.length)

	async function getUserProfile(token: string) {
		try {
			const response = await fetch('https://api.twitch.tv/helix/users', {
				headers: {
					'Client-ID': CLIENT_ID,
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				if (response.status === 401) {
					const storage = await getStorage()
					storage.auth.accessToken = ''
					storage.auth.isAuthenticated = false
					await saveStorage(storage)
					accessToken.value = null
					followedLiveStreams.value = []
					twitchUser.value = null
					throw new Error('Токен доступа истёк, выполните повторную авторизацию')
				}
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const data: { data: TwitchUser[] } = await response.json()
			const user = data.data[0]!

			return user
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			error.value = message
			twitchUser.value = null
			throw err
		}
	}

	async function getAllFollowedChannelsIds(token: string) {
		error.value = null
		try {
			const currentUser = twitchUser.value ?? (await getUserProfile(token))

			const followResponse = await fetch(
				`https://api.twitch.tv/helix/channels/followed?user_id=${currentUser.id}&first=100`,
				{
					headers: {
						'Client-ID': CLIENT_ID,
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!followResponse.ok) {
				throw new Error(`HTTP ${followResponse.status}: ${followResponse.statusText}`)
			}

			const response: {
				data: {
					broadcaster_id: string
					broadcaster_login: string
					broadcaster_name: string
					followed_at: string
				}[]
				pagination: {
					cursor: string
				}
				total: number
			} = await followResponse.json()

			return response.data.map((item) => item.broadcaster_id)
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)

			error.value = message

			throw err
		}
	}

	async function getDetailsAboutStreamers(token: string, ids: string): Promise<StreamersDetails[]> {
		error.value = null
		try {
			const followResponse = await fetch(`https://api.twitch.tv/helix/users?${ids}`, {
				headers: {
					'Client-ID': CLIENT_ID,
					Authorization: `Bearer ${token}`,
				},
			})

			if (!followResponse.ok) {
				throw new Error(`HTTP ${followResponse.status}: ${followResponse.statusText}`)
			}

			const response: {
				data: StreamersDetails[]
			} = await followResponse.json()

			return response.data
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)

			error.value = message

			throw err
		}
	}

	/**
	 * Loads all followed channels that are currently live.
	 *
	 * Uses Twitch Helix `Get Followed Streams` endpoint:
	 * https://dev.twitch.tv/docs/api/reference#get-followed-streams
	 *
	 * @param token OAuth access token.
	 * @returns A list of followed live streams.
	 */

	async function loadFollowedStreams(token: string) {
		loading.value = true
		error.value = null

		try {
			const currentUser = twitchUser.value ?? (await getUserProfile(token))

			const followResponse = await fetch(
				`https://api.twitch.tv/helix/streams/followed?user_id=${currentUser.id}`,
				{
					headers: {
						'Client-ID': CLIENT_ID,
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!followResponse.ok) {
				throw new Error(`HTTP ${followResponse.status}: ${followResponse.statusText}`)
			}

			const response: FollowResponse = await followResponse.json()

			followedLiveStreams.value = response.data
			return followedLiveStreams.value
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			error.value = message
			followedLiveStreams.value = []
			throw err
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
				`&scope=user:read:follows` //TODO: if we don't need user email, remove it (Twitch says if your app doesnt use some rules, then you must remove them or might get banned)

			const redirectUrl = await launchAuthFlow(authUrl)
			const token = extractTokenFromUrl(redirectUrl)
			if (!token) {
				throw new Error('Токен доступа не найден в URL редиректа')
			}

			accessToken.value = token
			const storage = await getStorage()
			storage.auth.accessToken = token
			storage.auth.isAuthenticated = true
			await saveStorage(storage)

			await getUserProfile(token)
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
		const storage = await getStorage()
		storage.auth.accessToken = ''
		storage.auth.isAuthenticated = false
		await saveStorage(storage)

		accessToken.value = null
		twitchUser.value = null
		followedLiveStreams.value = []
		followedAllStreams.value = []
		error.value = null
		loading.value = false
	}

	async function init() {
		loading.value = true
		try {
			const storage = await getStorage()

			if (storage.auth.accessToken) {
				accessToken.value = storage.auth.accessToken
				twitchUser.value = await getUserProfile(storage.auth.accessToken)
				followedLiveStreams.value = await loadFollowedStreams(storage.auth.accessToken)
				const ids = await getAllFollowedChannelsIds(accessToken.value)
				const stringifiedIds = ids.map((x) => `id=${x}`).join('&')
				followedAllStreams.value = await getDetailsAboutStreamers(
					storage.auth.accessToken,
					stringifiedIds
				)
			} else {
				accessToken.value = null
				twitchUser.value = null
				followedLiveStreams.value = []
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			error.value = message
		} finally {
			loading.value = false
		}
	}

	watch(followedLiveStreams, async () => {
		if (!isAuthenticated.value) {
			await chrome.action.setBadgeText({ text: '!' })
			await chrome.action.setBadgeBackgroundColor({ color: '#808080' })
		} else {
			await chrome.action.setBadgeText({ text: String(totalLiveStreamers.value) })
			await chrome.action.setBadgeBackgroundColor({ color: '#EB0400' })
			await chrome.action.setBadgeTextColor({ color: 'white' })
		}
	})

	return {
		accessToken,
		twitchUser,
		loading,
		error,
		followedLiveStreams,
		followedAllStreams,
		isAuthenticated,
		getUserProfile,
		loadFollowedStreams,
		loginWithTwitch,
		logout,
		init,

		getAllFollowedChannelsIds,
		getDetailsAboutStreamers,
	}
})
