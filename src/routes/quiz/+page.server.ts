import prisma from '$lib/prisma';
import { defaultQuizSize } from '$lib/constants.js';
import { createUserGuest } from '$lib/server/userGuest';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
  // TODO: Implement guest user tracking

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
    // Check if the user already has an active quiz and return if so
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

    if (quizWithQuestions) {
      return quizWithQuestions;
    }

    // If not, create a new quiz ID and store in the database
    const usersQuizCount =
      (await prisma.quiz.count({
        where: {
          userId: userId
        }
      })) || 0;

    const newQuiz = await prisma.quiz.create({
      data: {
        userId: userId,
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

    const newQuizWithQuestions = await prisma.quiz.findUnique({
      where: {
        id: newQuiz.id
      },
      include: {
        quizQuestions: {
          include: {
            question: true
          }
        }
      }
    });

    return newQuizWithQuestions;
  } catch (err) {
    console.error(err);
    throw error(500, 'Failed to fetch quiz');
  }
};
