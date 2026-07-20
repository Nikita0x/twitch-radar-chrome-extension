import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { formatUptime } from '@/utils/utils';
import { getStorage, saveStorage } from '@/services/storage.service';
import { fetchFollowedStreams } from '@/services/twitch-api';

interface TwitchUser {
	id: string;
	created_at: string;
	display_name: string;
	description: string;
	broadcaster_type: string;
	profile_image_url: string;
	offline_image_url: string;
	type: string;
	login: string;
	view_count: number;
}

export type FollowData = Pick<FollowResponse, 'data'>['data'][number];

interface FollowResponse {
	data: {
		game_id: string;
		game_name: string;
		id: string;
		is_mature: boolean;
		language: string;
		started_at: string;
		tag_ids: [];
		tags: string[];
		thumbnail_url: string;
		title: string;
		type: string;
		user_id: string;
		user_login: string;
		user_name: string;
		viewer_count: number;
	}[];
	pagination: {};
}

export interface StreamersDetails {
	broadcaster_type: string;
	created_at: string;
	description: string;
	display_name: string;
	id: string;
	login: string;
	offline_image_url: string;
	profile_image_url: string;
	type: string;
	view_count: number;
}

export const CLIENT_ID = 'cvem7bputjzs04pdh02g96bqb4wrj9';

function extractTokenFromUrl(url: string) {
	try {
		const hash = new URL(url).hash.substring(1);
		const params = new URLSearchParams(hash);
		return params.get('access_token');
	} catch {
		return null;
	}
}

/**
 * Sends a message to background service worker to perform OAuth via launchWebAuthFlow.
 * This keeps the WebAuthFlow alive even if the popup closes during auth.
 */
async function performOAuth(authUrl: string): Promise<string> {
	// console.log('[popup] Отправляю запрос OAuth в background...');
	const response = await chrome.runtime.sendMessage({ type: 'OAUTH_LOGIN', url: authUrl });
	// console.log('[popup] Получен ответ от background:', response);

	if (!response.ok) {
		throw new Error(response.error || 'Authorization error');
	}

	return response.redirectUrl;
}

export const useTwitchStore = defineStore('twitch', () => {
	const accessToken = ref<string | null>(null);
	const twitchUser = ref<TwitchUser | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const followedLiveStreams = ref<FollowData[]>([]);
	const followedAllStreams = ref<StreamersDetails[]>([]);

	const isAuthenticated = computed(() => !!accessToken.value);
	const totalLiveStreamers = computed(() => followedLiveStreams.value.length);

	async function getUserProfile(token: string) {
		try {
			const response = await fetch('https://api.twitch.tv/helix/users', {
				headers: {
					'Client-ID': CLIENT_ID,
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					const storage = await getStorage();
					storage.auth.accessToken = '';
					storage.auth.isAuthenticated = false;
					await saveStorage(storage);
					accessToken.value = null;
					followedLiveStreams.value = [];
					twitchUser.value = null;
					throw new Error('Токен доступа истёк, выполните повторную авторизацию');
				}
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data: { data: TwitchUser[] } = await response.json();
			const user = data.data[0]!;

			return user;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			error.value = message;
			twitchUser.value = null;
			throw err;
		}
	}

	async function getAllFollowedChannelsIds(token: string) {
		error.value = null;
		try {
			const currentUser = twitchUser.value ?? (await getUserProfile(token));
			const allIds: string[] = [];
			let cursor: string | undefined;

			do {
				const url = new URL('https://api.twitch.tv/helix/channels/followed');
				url.searchParams.set('user_id', currentUser.id);
				url.searchParams.set('first', '100');
				if (cursor) {
					url.searchParams.set('after', cursor);
				}

				const followResponse = await fetch(url.toString(), {
					headers: {
						'Client-ID': CLIENT_ID,
						Authorization: `Bearer ${token}`,
					},
				});

				if (!followResponse.ok) {
					throw new Error(`HTTP ${followResponse.status}: ${followResponse.statusText}`);
				}

				const response: {
					data: {
						broadcaster_id: string;
						broadcaster_login: string;
						broadcaster_name: string;
						followed_at: string;
					}[];
					pagination: {
						cursor: string;
					};
					total: number;
				} = await followResponse.json();

				allIds.push(...response.data.map((item) => item.broadcaster_id));
				cursor = response.pagination.cursor;
			} while (cursor);

			return allIds;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);

			error.value = message;

			throw err;
		}
	}

	async function getDetailsAboutStreamers(
		token: string,
		ids: string[]
	): Promise<StreamersDetails[]> {
		error.value = null;
		try {
			const allDetails: StreamersDetails[] = [];

			for (let i = 0; i < ids.length; i += 100) {
				const batch = ids.slice(i, i + 100);
				const query = batch.map((id) => `id=${id}`).join('&');

				const response = await fetch(`https://api.twitch.tv/helix/users?${query}`, {
					headers: {
						'Client-ID': CLIENT_ID,
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const data: { data: StreamersDetails[] } = await response.json();
				allDetails.push(...data.data);
			}

			return allDetails;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);

			error.value = message;

			throw err;
		}
	}

	async function loadFollowedStreams(token: string) {
		loading.value = true;
		error.value = null;

		try {
			const currentUser = twitchUser.value ?? (await getUserProfile(token));
			const streams = await fetchFollowedStreams(token, currentUser.id);

			followedLiveStreams.value = streams as FollowData[];
			return followedLiveStreams.value;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			error.value = message;
			followedLiveStreams.value = [];
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function loginWithTwitch() {
		loading.value = true;
		error.value = null;
		try {
			const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
			const authUrl =
				`https://id.twitch.tv/oauth2/authorize` +
				`?client_id=${CLIENT_ID}` +
				`&redirect_uri=${encodeURIComponent(redirectUri)}` +
				`&response_type=token` +
				`&scope=user:read:follows`;

			const oauthRedirectUrl = await performOAuth(authUrl);
			const token = extractTokenFromUrl(oauthRedirectUrl);
			if (!token) {
				throw new Error('Токен доступа не найден в URL редиректа');
			}

			accessToken.value = token;

			twitchUser.value = await getUserProfile(token);

			const storage = await getStorage();
			storage.auth.accessToken = token;
			storage.auth.isAuthenticated = true;
			storage.auth.userId = twitchUser.value.id;
			await saveStorage(storage);

			await loadFollowedStreams(token);

			const ids = await getAllFollowedChannelsIds(token);
			followedAllStreams.value = await getDetailsAboutStreamers(token, ids);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (message.includes('canceled') || message.includes('cancelled')) {
				console.log('Authorization declined by user.');
			} else {
				error.value = `Authorization error: ${message}`;
			}
		} finally {
			loading.value = false;
		}
	}

	async function logout() {
		const storage = await getStorage();
		storage.auth.accessToken = '';
		storage.auth.isAuthenticated = false;
		storage.auth.userId = '';
		await saveStorage(storage);

		accessToken.value = null;
		twitchUser.value = null;
		followedLiveStreams.value = [];
		followedAllStreams.value = [];
		error.value = null;
		loading.value = false;
	}

	async function init() {
		loading.value = true;
		try {
			const storage = await getStorage();

			if (storage.auth.accessToken) {
				accessToken.value = storage.auth.accessToken;
				twitchUser.value = await getUserProfile(accessToken.value);

				followedLiveStreams.value = await loadFollowedStreams(accessToken.value);
				const ids = await getAllFollowedChannelsIds(accessToken.value);
				followedAllStreams.value = await getDetailsAboutStreamers(accessToken.value, ids);
			} else {
				accessToken.value = null;
				twitchUser.value = null;
				followedLiveStreams.value = [];
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			error.value = message;
		} finally {
			loading.value = false;
		}
	}

	watch(followedLiveStreams, async () => {
		if (!isAuthenticated.value) {
			await chrome.action.setBadgeText({ text: '!' });
			await chrome.action.setBadgeBackgroundColor({ color: '#808080' });
		} else {
			await chrome.action.setBadgeText({ text: String(totalLiveStreamers.value) });
			await chrome.action.setBadgeBackgroundColor({ color: '#EB0400' });
			await chrome.action.setBadgeTextColor({ color: 'white' });
		}
	});

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
	};
});
