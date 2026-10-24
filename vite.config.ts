import { sentrySvelteKit } from '@sentry/sveltekit';
import Icons from 'unplugin-icons/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // Loads and validates env from .env.schema; must come before sveltekit()
    varlockVitePlugin(),
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'self-y2n',
        project: 'javascript-sveltekit'
      }
    }),
    Icons({
      compiler: 'svelte'
    }),
    sveltekit()
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.test.{js,mjs,ts}']
  }
});
