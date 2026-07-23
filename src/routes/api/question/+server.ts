import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
  // TODO implement this endpoint for global use outside of active quizzes
  // Get a random question from the database

  const count = await prisma.question.count();
  if (count === 0) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  const [question] = await prisma.question.findMany({
    take: 1,
    skip: Math.floor(Math.random() * count)
  });

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  return json(question);
}
