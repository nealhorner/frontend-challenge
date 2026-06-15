import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  // Revoke the BetterAuth session and clear its cookie. The sveltekitCookies
  // plugin attaches the cleared cookie to this response.
  if (event.locals.session) {
    await auth.api.signOut({ headers: event.request.headers });
  }

  // Redirect the user to the login page.
  throw redirect(303, '/login');
};
