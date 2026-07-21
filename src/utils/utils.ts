export function formatUptime(startedAt: string) {
	const started = new Date(startedAt);
	const now = new Date();
	const diffMs = Math.max(0, now.getTime() - started.getTime());
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

export function extractTokenFromUrl(url: string) {
	// Good
	try {
		const hash = new URL(url).hash.substring(1);
		const params = new URLSearchParams(hash);
		return params.get('access_token');
	} catch {
		return null;
	}
}
