// TODO:
// chrome.runtime.onInstalled.addListener(() => {
// 	chrome.alarms.create('check-streams', {
// 		periodInMinutes: 2,
// 	})
// })

// chrome.alarms.onAlarm.addListener(async () => {
// 	console.log('Checking Twitch')

// 	const streams = await loadFollowedStreams()

// 	await chrome.storage.local.set({
// 		streams,
// 	})

// 	updateBadge()
// })
