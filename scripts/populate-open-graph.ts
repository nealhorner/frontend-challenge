/**
 * Deployment seed step: populate Open Graph data (descriptions + images) for
 * learning resources so the data is rich on first load, before the scheduled
 * cron job (`/api/cron/open-graph`) runs.
 *
 * Invoked via `npm run populateLearningResources`, which the Railway
 * `releaseCommand` runs after migrations on every deploy.
 *
 * Best-effort by design: a flaky third-party site must not block a deploy, so
 * failures are logged and the process still exits 0. The cron job retries later.
 */
import prisma from '$lib/prisma';
import { populateLearningResourceOpenGraphData } from '$lib/open-graph';

try {
  await populateLearningResourceOpenGraphData();
  console.log('✓ Populated learning resource Open Graph data');
} catch (error) {
  console.error('⚠ Failed to populate Open Graph data (continuing deploy):', error);
} finally {
  await prisma.$disconnect();
}
