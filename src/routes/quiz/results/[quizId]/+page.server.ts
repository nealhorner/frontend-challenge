import { error, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { revealedQuestionSelect } from '$lib/server/questions';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }

  const quizResult = await prisma.quiz.findUnique({
    where: {
      id: params.quizId,
      isCompleted: true,
      userId: locals.user.id
    },
    include: {
      quizQuestions: {
        include: {
          // Only completed quizzes owned by the viewer match, so answers can be revealed.
          question: { select: revealedQuestionSelect }
        }
      }
    }
  });

  if (!quizResult) {
    error(404, 'Could not find quiz results');
  }

  return { quizResult };
}) satisfies PageServerLoad;
