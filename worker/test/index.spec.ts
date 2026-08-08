import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('CORS allowlist', () => {
	it('allows the Chrome Web Store (production) extension ID', async () => {
		const request = new IncomingRequest('https://worker.example.com/feedback', {
			method: 'OPTIONS',
			headers: {
				Origin: 'chrome-extension://fcjbgobfppjggabcbbnngehhefllbllm',
				'Access-Control-Request-Method': 'POST',
			},
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
			'chrome-extension://fcjbgobfppjggabcbbnngehhefllbllm'
		);
	});

	it('allows the local unpacked dev-install extension ID', async () => {
		const request = new IncomingRequest('https://worker.example.com/feedback', {
			method: 'OPTIONS',
			headers: {
				Origin: 'chrome-extension://anejamjbmgpekamgljajekmgnbppnjao',
				'Access-Control-Request-Method': 'POST',
			},
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
			'chrome-extension://anejamjbmgpekamgljajekmgnbppnjao'
		);
	});

	it('rejects an origin that is neither extension ID', async () => {
		const request = new IncomingRequest('https://worker.example.com/feedback', {
			method: 'OPTIONS',
			headers: {
				Origin: 'chrome-extension://some-random-other-extension',
				'Access-Control-Request-Method': 'POST',
			},
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
	});
});

describe('routes', () => {
	it('serves the uninstall survey page as HTML', async () => {
		const response = await SELF.fetch('https://worker.example.com/uninstall');

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toContain('text/html');
	});

	it('returns 404 for unknown paths', async () => {
		const response = await SELF.fetch('https://worker.example.com/does-not-exist');

		expect(response.status).toBe(404);
	});
});
