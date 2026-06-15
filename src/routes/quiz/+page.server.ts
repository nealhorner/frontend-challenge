import prisma from '$lib/prisma';
import { defaultQuizSize } from '$lib/constants.js';
import { auth } from '$lib/auth';

import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

async function selectQuestions(numberOfQuestions = defaultQuizSize) {
  const questions = [];
  const candidateQuestions = await prisma.question.findMany();
  for (let i = candidateQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidateQuestions[i], candidateQuestions[j]] = [candidateQuestions[j], candidateQuestions[i]];
  }

  const seenFamilies = new Set();

  for (const question of candidateQuestions) {
    if (!seenFamilies.has(question.family)) {
      questions.push(question);
      seenFamilies.add(question.family);
    }
    if (questions.length >= numberOfQuestions) {
      break;
    }
  }

  return questions;
}

export const load: PageServerLoad = async (event) => {
  let userId = event.locals.user?.id;

  if (!userId) {
    // No session yet: create a BetterAuth anonymous (guest) session. The
    // sveltekitCookies plugin attaches the session cookie to this response.
    const guest = await auth.api.signInAnonymous({ headers: event.request.headers });
    userId = guest?.user?.id;
    if (!userId) {
      throw error(500, 'Failed to create guest session');
    }
  }

  try {
    const quizWithQuestions = await prisma.quiz.findFirst({
      where: {
        userId: userId,
        isCompleted: false
      },
      include: {
        quizQuestions: {
          include: {
            question: true
          }
        }
      }
    });

    return { quiz: quizWithQuestions };
  } catch (err) {
    console.error(err);
    throw error(500, 'Failed to fetch quiz');
  }
};

export const actions: Actions = {
  start: async (event) => {
    const userId = event.locals.user?.id;
    if (!userId) {
      return redirect(302, '/quiz');
    }

    try {
      const existingQuiz = await prisma.quiz.findFirst({ where: { userId, isCompleted: false } });
      if (existingQuiz) {
        return fail(409, { message: 'You already have an active quiz' });
      }

      const questions = await selectQuestions();

      await prisma.$transaction(async (tx) => {
        const usersQuizCount = (await tx.quiz.count({ where: { userId } })) || 0;

        const newQuiz = await tx.quiz.create({
          data: { userId, title: `Quiz #${usersQuizCount + 1}` }
        });

        await Promise.all(
          questions.map((question) =>
            tx.quizQuestion.create({
              data: { quizId: newQuiz.id, questionId: question.id }
            })
          )
        );
      });
    } catch (err) {
      console.error(err);
      return fail(500, { message: 'Failed to create quiz' });
    }

    return redirect(302, '/quiz');
  }
};
