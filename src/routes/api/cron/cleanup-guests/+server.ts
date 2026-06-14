import { json } from '@sveltejs/kit';
import { deleteExpiredGuests } from '$lib/server/userGuest';

// Auth is enforced by src/routes/hooks.server.ts (Authorization: Bearer CRON_SECRET)
export async function GET() {
  const deleted = await deleteExpiredGuests();
  return json({ deleted });
}
