import prisma from '$lib/prisma';

interface UserRating {
  id: string;
  eloRating: number;
}

interface QuestionRating {
  id: string;
  eloRating: number;
}

function calculateElo(
  userRating: UserRating,
  questionRating: QuestionRating,
  questionAnsweredCorrectly: boolean
): { updatedUserRating: UserRating; updatedQuestionRating: QuestionRating } {
  const k = 32; // K-factor, determines the maximum possible adjustment per game
  const expectedScore = (ratingA: number, ratingB: number) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  };

  const userExpected = expectedScore(userRating.eloRating, questionRating.eloRating);
  const questionExpected = expectedScore(questionRating.eloRating, userRating.eloRating);

  const userScore = questionAnsweredCorrectly ? 1 : 0;
  const questionScore = questionAnsweredCorrectly ? 0 : 1;

  // userRating.eloRating = userRating.eloRating + k * (userScore - userExpected);
  // questionRating.eloRating = questionRating.eloRating + k * (questionScore - questionExpected);

  const updatedUserRating = {
    ...userRating,
    eloRating: userRating.eloRating + k * (userScore - userExpected)
  };

  const updatedQuestionRating = {
    ...questionRating,
    eloRating: questionRating.eloRating + k * (questionScore - questionExpected)
  };

  return { updatedUserRating, updatedQuestionRating };
}

async function updateEloRankings(
  userId: string,
  questionId: string,
  questionAnsweredCorrectly: boolean
) {
  const userRating = await prisma.user.findUnique({
    select: {
      id: true,
      eloRating: true
    },
    where: { id: userId }
  });

  const questionRating = await prisma.question.findUnique({
    select: {
      id: true,
      eloRating: true
    },
    where: { id: questionId }
  });

  if (!userRating || !questionRating) {
    console.error('User or question not found');
    return;
  }

  // Calculate the new rankings
  const { updatedUserRating, updatedQuestionRating } = calculateElo(
    userRating,
    questionRating,
    questionAnsweredCorrectly
  );

  // Update the user's ranking
  console.log(
    `User ${userId} Elo ranking updated to ${updatedUserRating.eloRating} from ${userRating.eloRating}`
  );
  await prisma.user.update({
    where: { id: userId },
    data: { eloRating: updatedUserRating.eloRating }
  });

  // Update the question's ranking
  console.log(
    `Question ${questionId} Elo ranking updated to ${updatedQuestionRating.eloRating}  from ${questionRating.eloRating}`
  );
  await prisma.question.update({
    where: { id: questionId },
    data: { eloRating: updatedQuestionRating.eloRating }
  });
}

export { updateEloRankings };
