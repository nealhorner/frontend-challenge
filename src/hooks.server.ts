import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();

const handleAuth: Handle = async ({ event, resolve }) => {
  // Populate locals from the BetterAuth session so server load/actions can use it.
  const sessionData = await auth.api.getSession({ headers: event.request.headers });

  event.locals.user = sessionData?.user ?? null;
  event.locals.session = sessionData?.session ?? null;
  // Anonymous (guest) users have a session but are not "authenticated" for the
  // app's purposes — preserves the previous role === 'USER' semantics.
  event.locals.isAuthenticated = !!sessionData?.user && !sessionData.user.isAnonymous;

  // svelteKitHandler serves the BetterAuth endpoints mounted at /api/auth/*.
  return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(sentryHandle(), handleAuth);
