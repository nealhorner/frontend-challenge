import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET({ params }) {
  // TODO implement this endpoint for global use outside of active quizzes

  const questionId = params.id;

  if (!questionId) {
    return json({ error: 'Missing questionId' }, { status: 400 });
  }

  const question = await prisma.question.findUnique({
    select: {
      id: true,
      family: true,
      title: true,
      prompt: true,
      type: true,
      multipleChoiceOptions: true,
      answers: false,
      tags: true
    },
    where: {
      id: questionId
    }
  });

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  return json(question);
}
