import prisma from '$lib/prisma';
import { testUserId } from '$lib/constants.js';
import { defaultQuizSize } from '$lib/constants.js';

import { error } from '@sveltejs/kit';

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

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const userId = cookies.get('userId') || testUserId; //TODO clean up after user auth setup

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
}
