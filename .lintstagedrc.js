// Globs don't overlap: lint-staged runs separate globs concurrently, so
// prettier and eslint must run in one ordered list or they clobber each other.
export default {
  '*.{json,css,md}': 'prettier --write',
  '*.{js,ts,svelte}': (files) => {
    const list = files.map((f) => JSON.stringify(f)).join(' ');
    const tasks = [
      `prettier --write ${list}`,
      `eslint --fix ${list}`,
      `vitest related --run --passWithNoTests ${list}`
    ];
    // svelte-check type-checks the whole project, so run it once after the fixes.
    if (files.some((f) => /\.(ts|svelte)$/.test(f))) tasks.push('npm run check');
    return tasks;
  }
};
