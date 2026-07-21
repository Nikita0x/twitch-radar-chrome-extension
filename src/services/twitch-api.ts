import { CLIENT_ID } from '@/constants';

export interface LiveStream {
	user_id: string;
	user_login: string;
	user_name: string;
	title: string;
	game_name: string;
	thumbnail_url: string;
}

/**
 * Fetches all followed live streams for a given user.
 * Handles pagination automatically.
 */
export async function fetchFollowedStreams(token: string, userId: string): Promise<LiveStream[]> {
	const allStreams: LiveStream[] = [];
	let cursor: string | undefined;

	do {
		const url = new URL('https://api.twitch.tv/helix/streams/followed');
		url.searchParams.set('user_id', userId);
		url.searchParams.set('first', '100');
		if (cursor) {
			url.searchParams.set('after', cursor);
		}

		const res = await fetch(url.toString(), {
			headers: {
				'Client-ID': CLIENT_ID,
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP ${res.status}: ${res.statusText}`);
		}

		const data = await res.json();
		allStreams.push(...data.data);
		cursor = data.pagination?.cursor;
	} while (cursor);

	return allStreams;
}
