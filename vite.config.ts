import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		sourcemap: false,
		rollupOptions: {
			input: {
				main: 'index.html',
				background: 'src/background/index.ts',
			},
			output: {
				entryFileNames: (chunkInfo) => {
					if (chunkInfo.name === 'background') {
						return 'background.js';
					}

					return 'assets/[name]-[hash].js';
				},
			},
		},
	},
});
