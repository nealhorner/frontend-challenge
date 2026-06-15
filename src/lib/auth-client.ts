import { createAuthClient } from 'better-auth/svelte';
import { anonymousClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [anonymousClient()]
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * BetterAuth's built-in body validation prefixes messages with the offending
 * field path, e.g. "[body.email] Invalid email address". Strip that prefix so
 * users see a clean, human-readable message.
 */
export function formatAuthError(message: string | undefined, fallback: string): string {
  if (!message) return fallback;
  return message.replace(/^\[[^\]]+\]\s*/, '').trim() || fallback;
}
