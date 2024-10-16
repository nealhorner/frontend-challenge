import { populateLearningResourceOpenGraphData } from '$lib/open-graph';

export function GET() {
  populateLearningResourceOpenGraphData();
  return new Response('Ran populateLearningResourceOpenGraphData()');
}
