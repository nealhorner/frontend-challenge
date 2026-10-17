export default {
  '*.{js,ts,svelte,json,css,md}': 'prettier --write',
  '*.{js,ts,svelte}': ['eslint --fix', 'vitest related --run --passWithNoTests'],
  '*.{ts,svelte}': () => 'npm run check'
};
