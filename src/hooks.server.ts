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
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();

const handleAuth: Handle = async ({ event, resolve }) => {
  // During the build/prerender there is no request context (and no
  // BETTER_AUTH_SECRET). Skip auth so BetterAuth is never initialized at build.
  if (building) {
    event.locals.user = null;
    event.locals.session = null;
    event.locals.isAuthenticated = false;
    return resolve(event);
  }

  // Populate locals from the BetterAuth session so server load/actions can use it.
  // Fall back to unauthenticated if session lookup fails rather than 500-ing the
  // whole request.
  let sessionData: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    sessionData = await auth.api.getSession({ headers: event.request.headers });
  } catch (error) {
    console.error('Failed to resolve session:', error);
  }

  event.locals.user = sessionData?.user ?? null;
  event.locals.session = sessionData?.session ?? null;
  // Anonymous (guest) users have a session but are not "authenticated" for the
  // app's purposes — preserves the previous role === 'USER' semantics.
  event.locals.isAuthenticated = !!sessionData?.user && !sessionData.user.isAnonymous;

  // svelteKitHandler serves the BetterAuth endpoints mounted at /api/auth/*.
  return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(sentryHandle(), handleAuth);
