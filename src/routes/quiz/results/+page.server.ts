import { error, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }

  const userId = locals.user.id;
  const quizResult = await prisma.quiz.findMany({
    where: {
      isCompleted: true,
      userId: userId
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
    error(404, `Could not find quiz results for user: ${userId}`);
  }

  return { quizResult };
}) satisfies PageServerLoad;
