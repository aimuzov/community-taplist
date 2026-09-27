import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	build: {
		// LG webOS 5 ships Chromium 68: lower the client bundle syntax for it.
		target: 'chrome68'
	}
});
