import { CLIENT_ID } from '@/constants';
import type { FollowData } from '@/stores/twitch';
import { request, type Result, ok, type Response } from '@/types/result';

export async function fetchFollowedLiveStreams(
	token: string,
	userId: string
): Promise<Result<FollowData[]>> {
	const allStreams: FollowData[] = [];
	let cursor: string | undefined;

	do {
		const url = new URL('https://api.twitch.tv/helix/streams/followed');
		url.searchParams.set('user_id', userId);
		url.searchParams.set('first', '100');
		if (cursor) {
			url.searchParams.set('after', cursor);
		}

		const result = await request<Response<FollowData[]>>(url.toString(), {
			headers: {
				'Client-ID': CLIENT_ID,
				Authorization: `Bearer ${token}`,
			},
		});

		if (!result.ok) {
			console.error(result.error);
			return result;
		}

		allStreams.push(...result.data.data);
		cursor = result.data.pagination?.cursor;
	} while (cursor);

	return ok(allStreams);
}
