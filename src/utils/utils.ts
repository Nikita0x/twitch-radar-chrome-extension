export function formatUptime(startedAt: string) {
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
