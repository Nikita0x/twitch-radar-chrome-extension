import { getStorage } from '@/services/storage.service'

const ALARM_NAME = 'periodic-notification'
const NOTIFICATION_TITLE = 'Twitch Radar'

function showNotification() {
	chrome.notifications.create({
		type: 'image',
		iconUrl: chrome.runtime.getURL('icon.png'),
		imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_kaicenat-200x100.jpg',
		title: NOTIFICATION_TITLE,
		message: `Проверка уведомлений · ${new Date().toLocaleTimeString('ru-RU')}`,
		priority: 2,
	})
}

// ← ЭТО СОЗДАЁТ ALARM. Без этого ничего не работает!
chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.create(ALARM_NAME, { periodInMinutes: 0.5 })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name !== ALARM_NAME) return

	const storage = await getStorage()

	if (!storage.auth.isAuthenticated) return
	if (!storage.userSettings.enableAllNotifications) return

	showNotification()
})
