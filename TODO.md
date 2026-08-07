# TODO

## Bugs
- [x] - При первой установке экстеншена - если выбирать сортинг то обнуляются все live streamers... — fixed: was a read-modify-write race in `storage.service.ts` (single "storage" blob key, any save could clobber a concurrent save to a different domain). Split into independent `auth`/`userSettings`/`runtime` keys.

## Features
- [ ] - Add survey after uninstall (`chrome.runtime.setUninstallURL('YourWebsite')`) - also use Cloudflare to send feedback to my Telegram;
- [ ] - use Cloudflare's KV storage - for saving user's settings and preferencase (id-{settings..})
- [ ] - Ability to send a message in chat [RESEARCH NEEDED]
- [ ] - Opening muted tabs?
- [ ] - Add a separate supporting page
- [ ] - Add a separate settings page
- [ ] - Add an ability to play sounds when stream events happen AND upload new custom sounds (with sensible defaults)
- [ ] - Ability to add channgels WITHOUT following them
- [ ] - Add grayscale effect on the #app when NO internet connection...

## UI/UX

- [ ] отдельно кнопка сердечка со страницей где будет написано донаты, и спонсоры
- [ ] Hide streamers — дать возможность скрывать стримеров для юзеров (не отписываясь)
- [ ] Keyword notifications — уведомлять если название стрима содержит ключевые слова
- [ ] Quiet hours — не уведомлять если ночь и тд
- [ ] Streamer groups — кастомные группы с цветами

## Refactoring

- [ ] Centralize erros and show them to user `error.value = null` — include `browser.runtime.id` in the displayed error so a user screenshot is enough to identify which build/store install reported it (this is what made the dev-vs-prod redirect URI mismatch invisible until a user reported it)
