import prisma from '$lib/prisma';
import { defaultQuizSize } from '$lib/constants.js';
import { createUserGuest } from '$lib/server/userGuest';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';

import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

async function selectQuestions(numberOfQuestions = defaultQuizSize) {
  const questions = [];
  let candidateQuestions = await prisma.question.findMany();
  candidateQuestions = candidateQuestions.sort(() => 0.5 - Math.random());

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
  let userId;

  if (!event.locals.user) {
    const guestUser = await createUserGuest();
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, guestUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    userId = guestUser.id;
  } else {
    userId = event.locals.user.id;
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
      const usersQuizCount =
        (await prisma.quiz.count({
          where: { userId }
        })) || 0;

      const newQuiz = await prisma.quiz.create({
        data: {
          userId,
          title: `Quiz #${usersQuizCount + 1}`
        }
      });

      const questions = await selectQuestions();
      await Promise.all(
        questions.map((question) =>
          prisma.quizQuestion.create({
            data: {
              quizId: newQuiz.id,
              questionId: question.id
            }
          })
        )
      );
    } catch (err) {
      console.error(err);
      return fail(500, { message: 'Failed to create quiz' });
    }

    return redirect(302, '/quiz');
  }
};
