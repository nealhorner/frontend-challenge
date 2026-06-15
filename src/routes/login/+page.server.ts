import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // If the user is already authenticated, redirect to the main page.
  if (locals.isAuthenticated) {
    return redirect(302, '/');
  }
  return {};
};
