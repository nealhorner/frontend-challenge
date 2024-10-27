import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
  const { quizId, questionId, userAnswer } = await request.json();

  if (!quizId || !questionId) {
    return json({ error: 'Missing quizId or questionId' }, { status: 400 });
  }

  // Get the question to validate the user's answer
  const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  // Check if the question is already answered
  const existingAnswer = await prisma.quizQuestion.findUnique({
    select: { isAnswered: true },
    where: { quizId_questionId: { quizId, questionId } }
  });
  if (existingAnswer && existingAnswer.isAnswered) {
    return json({ error: 'Question already answered' }, { status: 400 });
  }

  // Validate the user's answer
  const correctAnswers = JSON.parse(question.answers);
  const isCorrect = correctAnswers.includes(userAnswer);

  console.log('isCorrect', isCorrect, correctAnswers, userAnswer);

  // Save the user's answer, update QuizQuestion
  const savedAnswer = await prisma.quizQuestion.update({
    where: {
      quizId_questionId: { quizId, questionId }
    },
    data: {
      answer: userAnswer,
      isAnswered: true,
      isCorrect,
      answeredTimestamp: new Date()
    }
  });

  // Check if this is the last question in the quiz
  const quizQuestions = await prisma.quizQuestion.findMany({
    where: { quizId, isAnswered: false }
  });
  const isCompleted = quizQuestions.length === 0;

  // Update the Quiz
  if (isCompleted) {
    const score = 0; // TODO calculate score
    await prisma.quiz.update({
      where: { id: quizId },
      data: { isCompleted, score }
    });

    // TODO Trigger non-blocking tasks to update question and user stats
  }

  return json(savedAnswer);
};
