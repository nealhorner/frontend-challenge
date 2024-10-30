import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { defaultQuizSize } from '$lib/constants';

export async function GET() {
  // TODO implement this endpoint for global use outside of active quizzes
  // Get a random question from the database

  const questions = await prisma.question.findMany({
    take: defaultQuizSize
    // TODO improve randomization
  });

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  return json(question);
}
