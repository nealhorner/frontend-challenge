import { sentrySvelteKit } from '@sentry/sveltekit';
import Icons from 'unplugin-icons/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
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
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
