import { json } from '@sveltejs/kit';

export function GET() {
  // TODO implement this endpoint for global use outside of active quizzes
  const question = {};

  return json(question);
}
