# TODO

## Features
- [ ] - Port to FireFox
- [ ] - Ability to send a message in chat [RESEARCH NEEDED]
- [ ] - Opening muted tabs?
- [ ] - Add a separate supporting page
- [ ] - Add a separate settings page


## UI/UX

- [ ] отдельно кнопка сердечка со страницей где будет написано донаты, и спонсоры
- [ ] Переделать icon.png - придумать дизайн и уменьшить размеры
- [ ] Hide streamers — дать возможность скрывать стримеров для юзеров (не отписываясь)
- [ ] Keyword notifications — уведомлять если название стрима содержит ключевые слова
- [ ] Quiet hours — не уведомлять если ночь и тд
- [ ] Streamer groups — кастомные группы с цветами

## Refactoring

- [ ] Вынести типы (`TwitchUser`, `FollowData`, `StreamersDetails`) в `src/types/twitch.ts`
- [ ] Вынести `performOAuth` в `src/services/auth.service.ts`
- [ ] Вынести `getAllFollowedChannelsIds` в `src/services/twitch-api.ts`
- [ ] Разбить `loginWithTwitch` — вынести цепочку загрузки данных в отдельный метод
- [ ] Централизовать `error.value = null`
- [ ] Update userSettings to have streamerNotifications inside (change the structure)
- [ ] Вынести Switch/Toggle в отдельный  компонент (в нутри StreamerSettingsTab)
- [x] Как то выделить StreamerCard - когда юзер включил нотификации или по тайтлу или по auto open tab или по категории
