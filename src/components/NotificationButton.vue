<template>
	<button @click="sendNotification" class="notify-btn">Отправить уведомление</button>
</template>

<script setup lang="ts">
function sendNotification() {
	// Проверяем, запущено ли приложение как расширение Chrome
	if (typeof chrome !== 'undefined' && chrome.notifications) {
		chrome.notifications.create('my-notification-id', {
			type: 'basic',
			iconUrl: 'icon.png', // Иконка из папки public/ (скопируется в корень dist/)
			title: 'Привет от расширения!',
			message: 'Это системное уведомление работает на Windows, macOS и Linux!',
			priority: 2,
		})
	} else {
		// Фолбек для обычного браузера (если тестируете не как расширение)
		if (Notification.permission === 'granted') {
			new Notification('Привет из браузера!', {
				body: 'Это стандартное веб-уведомление.',
			})
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					new Notification('Привет из браузера!', {
						body: 'Это стандартное веб-уведомление.',
					})
				}
			})
		}
	}
}
</script>

<style scoped>
.notify-btn {
	background-color: #4caf50;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 14px;
	font-weight: bold;
	margin: 10px 0;
	cursor: pointer;
	border-radius: 6px;
	transition: background-color 0.2s;
}

.notify-btn:hover {
	background-color: #45a049;
}
</style>
