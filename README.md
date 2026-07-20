# Twitch Radar

![Twitch Radar Icon](public/icon128.png)

A fast, lightweight Chrome extension that tracks your followed Twitch streamers and sends desktop notifications when they go live.

## Features

- 🔴 **Live notifications** — get desktop alerts when a followed streamer starts streaming
- 🔍 **Search & filter** — quickly find streamers by name
- 📊 **Sorting** — sort by viewers or stream duration
- 🔢 **Badge counter** — see how many streamers are live right on the extension icon
- 🎨 **Custom UI** — clean, modern interface built with Vue 3

## Installation

### Chrome Web Store

[Link to Chrome Web Store — coming soon]

### Load unpacked (for development)

1. Clone the repo
2. Run `npm install` and `npm run build`
3. Open `chrome://extensions/`
4. Enable **Developer mode**
5. Click **Load unpacked** and select the `dist/` folder

## Build Commands

```sh
npm install           # install dependencies
npm run dev           # live development build (watch mode)
npm run build         # build an extension (then load `dist` folder)
npm run check         # TypeScript type check
```

## Report an Issue

Found a bug or have a feature request? [Open an issue](https://github.com/Nikita0x/chrome-extension/issues) on GitHub.

## Contributing

Pull requests are welcome! If you'd like to help improve Twitch Radar, feel free to fork the repo and submit a PR.