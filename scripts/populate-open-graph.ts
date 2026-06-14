/**
 * Populate Open Graph data (descriptions + images) for learning resources so
 * the data is rich on first load.
 *
 * Invoked two ways:
 *  - `npm run populateLearningResources`, which the Railway `releaseCommand`
 *    runs after migrations on every deploy (seed step).
 *  - the scheduled Railway cron service that runs the same script daily.
 *
 * Best-effort by design: a flaky third-party site must not block a deploy, so
 * failures are logged and the process still exits 0. The next run retries.
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
