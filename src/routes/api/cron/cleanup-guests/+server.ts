import { json } from '@sveltejs/kit';
import { deleteExpiredGuests } from '$lib/server/userGuest';
import { env } from '$env/dynamic/private';

export async function GET({ request }) {
  const secret = env.CRON_SECRET;
  if (!secret || request.headers.get('x-cron-secret') !== secret) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  const deleted = await deleteExpiredGuests();
  return json({ deleted });
}
