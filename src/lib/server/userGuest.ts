import prisma from '$lib/prisma';

export const createUserGuest = async function () {
  // Create a new guess user in the database

  const uuid = crypto.randomUUID();

  // Guest accounts expire after 30 days
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  return await prisma.user.create({
    data: {
      id: uuid,
      role: 'GUEST',
      UserGuest: {
        create: {
          expiresAt: expiresAt
        }
      },
      UserStats: {
        create: {}
      }
    }
  });
  //TODO collect stats
};

export const deleteUserGuest = async function (userId: string) {
  await prisma.user.delete({ where: { id: userId } });
};

export const migrateGuestToUser = async function (guestId: string, newUserId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.quiz.updateMany({
      where: { userId: guestId },
      data: { userId: newUserId }
    });

    const guestStats = await tx.userStats.findUnique({ where: { userId: guestId } });
    if (guestStats) {
      const newUserStats = await tx.userStats.update({
        where: { userId: newUserId },
        data: {
          totalQuizzesTaken: guestStats.totalQuizzesTaken,
          totalQuestionsAnswered: guestStats.totalQuestionsAnswered,
          totalCorrectAnswers: guestStats.totalCorrectAnswers,
          rank: guestStats.rank,
          eloRating: guestStats.eloRating
        }
      });

      await tx.userStatsTrends.updateMany({
        where: { userStatsId: guestStats.id },
        data: { userStatsId: newUserStats.id }
      });
    }

    await tx.user.delete({ where: { id: guestId } });
  });
};
