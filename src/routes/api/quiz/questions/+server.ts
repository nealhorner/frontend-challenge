import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import { updateEloRankings } from '$lib/eloRating';
import type { QuizDataWithoutQuestions } from '$lib/types';
import { getUTCDate } from '$lib/datetime/date';
import { computeStreaks } from '$lib/streak';
import { STREAK_WINDOW_DAYS } from '$lib/constants';

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
  let isCorrect = false;
  if (question.type === 'multiple-choice' && correctAnswers.length === 0 && userAnswer === '') {
    isCorrect = true;
  } else {
    isCorrect = correctAnswers.includes(userAnswer);
  }

  console.log('isCorrect', {
    isCorrect: isCorrect,
    correctAnswers: correctAnswers,
    userAnswer: userAnswer,
    prompt: question.prompt,
    type: question.type,
    correctAnswersLength: correctAnswers.length
  });

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

  console.log('isCompleted', isCompleted);

  // Update the Quiz
  if (isCompleted) {
    const quizWithQuestions = await prisma.quiz.findUniqueOrThrow({
      where: {
        id: quizId
      },
      include: {
        quizQuestions: true
      }
    });

    // Calculate the score
    const score = quizWithQuestions.quizQuestions.filter((q) => q.isCorrect).length * 10;
    await prisma.quiz.update({
      where: { id: quizId },
      data: { isCompleted, score }
    });

    // Perform post-quiz tasks
    void postQuizTasksNonBlocking(quizWithQuestions).catch((error) => {
      console.error('postQuizTasksNonBlocking failed', { quizId: quizWithQuestions.id, error });
    });
  }

  return json(savedAnswer);
};

async function postQuizTasksNonBlocking(quizWithQuestions: QuizDataWithoutQuestions) {
  const correctAnswers = quizWithQuestions.quizQuestions.filter((q) => q.isCorrect).length;

  // Update the UserStats
  const userStats = await prisma.userStats.upsert({
    where: { userId: quizWithQuestions.userId },
    update: {
      totalQuizzesTaken: {
        increment: 1
      },
      totalQuestionsAnswered: {
        increment: quizWithQuestions.quizQuestions.length
      },
      totalCorrectAnswers: {
        increment: correctAnswers
      }
    },
    create: {
      userId: quizWithQuestions.userId,
      totalQuizzesTaken: 1,
      totalQuestionsAnswered: quizWithQuestions.quizQuestions.length,
      totalCorrectAnswers: correctAnswers
    }
  });

  // Update the Elo Ratings
  for (const quizQuestion of quizWithQuestions.quizQuestions) {
    await updateEloRankings(
      quizWithQuestions.userId,
      quizQuestion.questionId,
      quizQuestion.isCorrect ?? false
    ).catch((error: string) => {
      console.error('Failed to update Elo rating:', error);
    });
  }

  // Update user ranking by their eloRating from the UserStats table
  await prisma.$executeRaw`
    WITH RankedData AS (
        SELECT 
            us.id, 
            us."userId", 
            RANK() OVER (ORDER BY "eloRating" DESC, us.id ASC) AS new_rank
        FROM "UserStats" us
    )
    UPDATE "UserStats"
    SET "rank" = RankedData.new_rank
    FROM RankedData
    WHERE "UserStats".id = RankedData.id;
  `;

  // Update the Stats Trends
  const dateUTC: Date = getUTCDate();
  await prisma.userStatsTrends.upsert({
    where: {
      user_stats_trend_user_id_date: {
        userStatsId: userStats.id,
        date: dateUTC
      }
    },
    update: {
      totalQuizzesTaken: {
        increment: 1
      },
      totalQuestionsAnswered: {
        increment: quizWithQuestions.quizQuestions.length
      },
      totalCorrectAnswers: {
        increment: correctAnswers
      }
    },
    create: {
      userStatsId: userStats.id,
      date: dateUTC,
      totalQuizzesTaken: 1,
      totalQuestionsAnswered: quizWithQuestions.quizQuestions.length,
      totalCorrectAnswers: correctAnswers
    }
  });

  // Recompute the streak from the per-day trend records (one row per active
  // day) so the stored value is always consistent, even if a day was missed.
  const activeDays = await prisma.userStatsTrends.findMany({
    where: { userStatsId: userStats.id },
    select: { date: true }
  });
  const { currentStreak, longestStreak } = computeStreaks(
    activeDays.map((d) => d.date),
    STREAK_WINDOW_DAYS,
    dateUTC
  );
  await prisma.userStats.update({
    where: { id: userStats.id },
    data: { currentStreak, longestStreak }
  });
}
