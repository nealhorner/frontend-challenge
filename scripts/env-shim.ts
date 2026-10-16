// Stand-in for SvelteKit's `$env/dynamic/private` when code under src/lib runs
// via tsx (see scripts/tsconfig.json).
export const env: Record<string, string | undefined> = process.env;
