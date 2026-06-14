import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
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
    adapter: process.env.VERCEL ? adapterVercel() : adapterNode()
  }
};

export default config;
