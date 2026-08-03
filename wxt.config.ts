import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: 'src',
	// Unlike entrypointsDir, WXT resolves publicDir relative to the project root,
	// not srcDir — has to be set explicitly since public/ lives under src/.
	publicDir: 'src/public',
	modules: ['@wxt-dev/module-vue'],
	manifest: {
		name: 'Twitch Radar – Live Stream Notifications',
		description: 'Get desktop notifications when your favorite Twitch streamers go live.',
		version: '1.4.0',
		permissions: ['notifications', 'identity', 'storage', 'alarms'],
		host_permissions: ['https://api.twitch.tv/*'],
		icons: {
			16: 'icon16.png',
			32: 'icon32.png',
			48: 'icon48.png',
			128: 'icon128.png',
		},
		action: {
			default_icon: {
				16: 'icon16.png',
				32: 'icon32.png',
			},
		},
		// Fixed Firefox add-on ID. Keeps `browser.identity.getRedirectURL()` (and
		// the moz-extension:// URL in general) stable across rebuilds/reinstalls —
		// required for the OAuth redirect URI registered with Twitch to keep working.
		browser_specific_settings: {
			gecko: {
				id: 'twitch-radar@nikita0x',
			},
		},
	},
});
