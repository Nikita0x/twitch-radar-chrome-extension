# TODO

## Features

- [x] Нотификации когда стример включил трансляцию (если уже live - то не присылать)
- [ ] Разделить нотификации на три типа (глобальные настройки + пер-стримерные):
  - [ ] when streamer goes live (offline → online)
  - [ ] when streamer changes the title
  - [ ] when streamer changes the category (game)
- [ ] Добавить возможность включать и отключать:
  - [x] нотификации
  - [ ] автоматически открывать вкладку (auto-open tab) — `chrome.tabs.create()`
  - [ ] возможно отправка сообщения в чат? (если возможно)
- [x] Сохранять пользовательские настройки - чтобы при выходе из авторизации и заходе обратно - настройки сохранялись
- [x] Dark theme — реализован через CSS-переменные, переключатель в SettingsTab
- [x] `getAllFollowedChannelsIds` — переписать на `request()` вместо raw `fetch` (уже было сделано)

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
