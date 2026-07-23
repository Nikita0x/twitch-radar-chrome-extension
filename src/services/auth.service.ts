/**
 * Sends a message to background service worker to perform OAuth via launchWebAuthFlow.
 * This keeps the WebAuthFlow alive even if the popup closes during auth.
 */
export async function performOAuth(authUrl: string): Promise<string> {
	const response = await chrome.runtime.sendMessage({ type: 'OAUTH_LOGIN', url: authUrl });

	if (!response.ok) {
		throw new Error(response.error || 'Authorization error');
	}

	return response.redirectUrl;
}
