# Twitch Radar

![Twitch Radar Icon](public/icon128.png)

A fast, lightweight Chrome extension that tracks your followed Twitch streamers and sends desktop notifications when they go live.

## Features

- 🔴 Instant desktop notifications when followed streamers go live
- ⚙️ Per-streamer notification settings with customizable alerts and auto-open actions
- 🔍 Search through your followed channels
- 📊 Sort streams by viewer count or stream duration
- ⚡ Fast and lightweight interface
- 🌙 Light and dark themes
- 👤 Secure sign in with your Twitch account
- 🔒 Read-only access — your password is never shared or stored

## Installation

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
npm run format        # Format project with prettier
```

## Report an Issue

Found a bug or have a feature request? [Open an issue](https://github.com/Nikita0x/chrome-extension/issues) on GitHub.

## Contributing

Pull requests are welcome! If you'd like to help improve Twitch Radar, feel free to fork the repo and submit a PR.
