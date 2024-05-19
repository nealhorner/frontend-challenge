import { error, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Protect the /api/cron endpoint
  if (event.url.pathname.startsWith('/api/cron')) {
    if (event.request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      throw error(401, 'Unauthorized');
    }
  }

  const response = await resolve(event);

  return response;
};
