import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  vitePlugin: {
    // Force runes mode for our own components so no file can silently fall back
    // to Svelte 4 legacy syntax. Third-party .svelte components in node_modules
    // (e.g. @fortawesome/svelte-fontawesome) are left in legacy mode.
    dynamicCompileOptions({ filename, compileOptions }) {
      if (!filename.includes('/node_modules/') && !compileOptions.runes) {
        return { runes: true };
      }
    }
  },

  kit: {
    // Hosted on Railway: `npm run build` emits a Node server in build/, started
    // with `node build` (see railway.json).
    adapter: adapter()
  }
};

export default config;
