// Stand-in for SvelteKit's `$env/dynamic/private` and `$app/environment` when
// code under src/lib runs via tsx (see scripts/tsconfig.json).
export const env: Record<string, string | undefined> = process.env;
export const building = false;
