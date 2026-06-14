import { json } from '@sveltejs/kit';
import { deleteExpiredGuests } from '$lib/server/userGuest';

// TODO: This endpoint is currently unauthenticated and publicly triggerable.
// Revisit during the host provider migration to protect it (e.g. a cron secret
// header) and wire it up to the new scheduler.
export async function GET() {
  const deleted = await deleteExpiredGuests();
  return json({ deleted });
}
