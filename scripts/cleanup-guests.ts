/**
 * Scheduled cleanup: delete expired guest users (and their related rows).
 *
 * Run as a one-shot Railway cron service via `npm run cleanupGuests`. It calls
 * `deleteExpiredGuests()` directly against the database, so no public endpoint
 * is involved.
 *
 * Best-effort by design: a failure is logged and must not crash the cron
 * runner in a confusing way, but we still surface a non-zero state so Railway's
 * restart policy can retry.
 */
import prisma from '$lib/prisma';
import { deleteExpiredGuests } from '$lib/server/userGuest';

try {
  const deleted = await deleteExpiredGuests();
  console.log(`✓ Deleted ${deleted} expired guest user(s)`);
} catch (error) {
  console.error('⚠ Failed to delete expired guests:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
