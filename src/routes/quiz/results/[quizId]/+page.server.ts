import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const quizResult = await prisma.quiz.findUnique({
    where: {
      id: params.quizId,
      isCompleted: true
    },
    include: {
      quizQuestions: {
        include: {
          question: true
        }
      }
    }
  });

  if (!quizResult) {
    error(404, `Could not find quiz results for ${params.quizId}`);
  }

  return { quizResult };
}) satisfies PageServerLoad;
