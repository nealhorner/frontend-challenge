import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

async function getRandomQuestion() {
  const count = await prisma.question.count();
  if (count === 0) return null;

  // orderBy makes the random offset meaningful — without a defined order,
  // the database is free to return rows in any sequence, so `skip` wouldn't
  // reliably land on a well-distributed random row.
  const [question] = await prisma.question.findMany({
    orderBy: { id: 'asc' },
    take: 1,
    skip: Math.floor(Math.random() * count)
  });

  return question ?? null;
}

export async function GET() {
  // TODO implement this endpoint for global use outside of active quizzes
  // Get a random question from the database

  // count() and findMany() aren't in a transaction, so a row deleted in
  // between could make the offset land past the new end. Retry once with a
  // fresh count before concluding there's truly nothing to return.
  const question = (await getRandomQuestion()) ?? (await getRandomQuestion());

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  return json(question);
}
