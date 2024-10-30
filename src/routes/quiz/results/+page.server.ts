import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { testUserId } from '$lib/constants';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
  const userId = cookies.get('userId') || testUserId; //TODO clean up after user auth setup
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
