import { building } from '$app/environment';
import { getEnabledSocialProviders } from '$lib/server/socialProviders';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  return {
    isAuthenticated: event.locals.isAuthenticated,
    // (not read while prerendering: the home page doesn't show them)
    socialProviders: building ? [] : getEnabledSocialProviders()
  };
};
