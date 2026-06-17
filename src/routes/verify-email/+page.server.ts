import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user?.emailVerified) {
    throw redirect(302, '/');
  }

  return {
    email: url.searchParams.get('email') ?? ''
  };
};
