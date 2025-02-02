import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function POST(event) {
  if (event.locals.session) {
    await invalidateSession(event.locals.session.id);
    deleteSessionTokenCookie(event);
  }

  // Redirect the user to the login page
  throw redirect(303, '/login');
}
