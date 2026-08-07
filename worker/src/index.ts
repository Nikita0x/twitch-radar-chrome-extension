/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import type { Feedback } from '../../shared/feedback.interface';

// Chrome's extension ID is a hash of the public key pinned in wxt.config.ts,
// so it's the same for every install (dev and published). Firefox has no
// equivalent: moz-extension:// UUIDs are randomized per browser profile by
// design (anti-fingerprinting), so they can't be pinned — only the scheme
// prefix can be checked.
const ALLOWED_ORIGINS = new Set(['chrome-extension://anejamjbmgpekamgljajekmgnbppnjao']);

function isAllowedOrigin(origin: string | null): origin is string {
	if (!origin) return false;
	return ALLOWED_ORIGINS.has(origin) || origin.startsWith('moz-extension://');
}

// No Access-Control-Allow-Origin at all (rather than a fixed value) is what
// makes disallowed origins fail: the browser refuses to send the real
// request once the OPTIONS preflight comes back without permission.
function corsHeaders(origin: string | null): HeadersInit {
	if (!isAllowedOrigin(origin)) return {};

	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const headers = corsHeaders(request.headers.get('Origin'));

		if (url.pathname === '/feedback') {
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers });
			}

			if (request.method !== 'POST') {
				return Response.json({ code: 405, error: 'Method not allowed' }, { status: 405, headers });
			}

			const feedback = await request.json<Feedback>();

			const text = [
				'New uninstall feedback',
				`Reason: ${feedback.reason}`,
				`Version: ${feedback.manifestVersion}`,
				`OS: ${feedback.operatingSystem}`,
				`Extension ID: ${feedback.extensionID}`,
				`Browser: ${feedback.browserName}`,
			].join('\n');

			const telegramResp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: env.TELEGRAM_CHAT_ID,
					text,
				}),
			});

			if (!telegramResp.ok) {
				return Response.json({ code: 502, error: 'Failed to deliver feedback' }, { status: 502, headers });
			}

			return Response.json({ code: 200, success: 'Feedback was received.' }, { headers });
		}

		return new Response('Not Found', { status: 404, headers });
	},
} satisfies ExportedHandler<Env>;
