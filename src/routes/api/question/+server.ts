import { json } from '@sveltejs/kit';
import { getRandomPublicQuestion } from '$lib/server/questions';

export async function GET() {
  // TODO implement this endpoint for global use outside of active quizzes
  // Get a random question from the database

  const question = await getRandomPublicQuestion();

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  return json(question);
}
