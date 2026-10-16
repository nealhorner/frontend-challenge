import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import { updateEloRankings } from '$lib/eloRating';
import { QuestionType, type QuizDataWithoutQuestions } from '$lib/types';
import { getUTCDate } from '$lib/datetime/date';
import { computeStreaks } from '$lib/streak';
import { STREAK_WINDOW_DAYS } from '$lib/constants';
import { getPrivateQuestion } from '$lib/server/questions';

export const POST = async ({ request, locals }) => {
  // The caller must be signed in (guests included) to submit answers.
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { quizId, questionId, userAnswer } = await request.json();

  if (!quizId || !questionId) {
    return json({ error: 'Missing quizId or questionId' }, { status: 400 });
  }

  // Ensure the quiz exists and belongs to the requesting user before mutating it.
  const quiz = await prisma.quiz.findUnique({
    select: { userId: true, isCompleted: true },
    where: { id: quizId }
  });
  if (!quiz) {
    return json({ error: 'Quiz not found' }, { status: 404 });
  }
  if (quiz.userId !== userId) {
    return json({ error: 'Forbidden' }, { status: 403 });
  }

  const existingAnswer = await prisma.quizQuestion.findUnique({
    where: { quizId_questionId: { quizId, questionId } }
  });
  if (!existingAnswer) {
    return json({ error: 'Question is not part of this quiz' }, { status: 404 });
  }
  // A repeat submit of an answered question is a retry whose response was lost
  // (the answer was saved but the client never heard back). Return the saved
  // record so the client can move on; the first answer stands. This runs
  // before the completed check so a retry of the final question succeeds too.
  if (existingAnswer.isAnswered) {
    // The first request may have saved the final answer and then failed before
    // marking the quiz complete. Finish that now, so the client isn't sent to
    // results for a quiz that isn't complete. If it fails again, the error
    // surfaces and the client can retry once more.
    if (!quiz.isCompleted) {
      await completeQuizIfFinished(quizId);
    }
    return json(existingAnswer);
  }
  if (quiz.isCompleted) {
    return json({ error: 'Quiz already completed' }, { status: 400 });
  }

  // Get the question, including its answers, to validate the user's answer
  const question = await getPrivateQuestion(questionId);

  if (!question) {
    return json({ error: 'Question not found' }, { status: 404 });
  }

  // Validate the user's answer
  const correctAnswers = JSON.parse(question.answers);
  let isCorrect = false;
  if (
    question.type === QuestionType.MultipleChoice &&
    correctAnswers.length === 0 &&
    userAnswer === ''
  ) {
    isCorrect = true;
  } else {
    isCorrect = correctAnswers.includes(userAnswer);
  }

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

  await completeQuizIfFinished(quizId);

  return json(savedAnswer);
};

// Marks the quiz complete and scores it once every question is answered. Safe
// to call more than once: the update only matches a quiz that isn't complete
// yet, so only the call that actually completes it runs the post-quiz tasks.
async function completeQuizIfFinished(quizId: string) {
  const unanswered = await prisma.quizQuestion.count({
    where: { quizId, isAnswered: false }
  });
  if (unanswered > 0) return;

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
  const { count } = await prisma.quiz.updateMany({
    where: { id: quizId, isCompleted: false },
    data: { isCompleted: true, score }
  });

  // Perform post-quiz tasks
  if (count > 0) {
    void postQuizTasksNonBlocking(quizWithQuestions).catch((error) => {
      console.error('postQuizTasksNonBlocking failed', { quizId: quizWithQuestions.id, error });
    });
  }
}

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
