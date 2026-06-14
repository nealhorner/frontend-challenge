import { error, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Protect the /api/cron endpoint
  if (event.url.pathname.startsWith('/api/cron')) {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || event.request.headers.get('Authorization') !== `Bearer ${cronSecret}`) {
      throw error(401, 'Unauthorized');
    }
  }

  const response = await resolve(event);

  return response;
};
