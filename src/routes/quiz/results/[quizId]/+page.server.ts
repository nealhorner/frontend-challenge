import { error, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
  if (!locals.user) {
    redirect(302, '/');
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
          question: true
        }
      }
    }
  });

  if (!quizResult) {
    error(404, 'Could not find quiz results');
  }

  return { quizResult };
}) satisfies PageServerLoad;
