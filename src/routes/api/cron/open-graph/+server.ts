import { populateLearningResourceOpenGraphData } from '$lib/open-graph';

export function GET({ request }) {
  populateLearningResourceOpenGraphData();
  return new Response('Hello Cron!');
}
