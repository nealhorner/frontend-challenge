import prisma from '$lib/prisma';

export const createUserGuest = async function () {
  // Create a new guest user in the database

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
  const result = await prisma.user.deleteMany({ where: { id: userId, role: 'GUEST' } });
  if (result.count !== 1) {
    throw new Error(`Guest user not found: ${userId}`);
  }
};

export const deleteExpiredGuests = async function () {
  const result = await prisma.user.deleteMany({
    where: {
      role: 'GUEST',
      UserGuest: {
        expiresAt: { lt: new Date() }
      }
    }
  });
  return result.count;
};

export const migrateGuestToUser = async function (guestId: string, newUserId: string) {
  if (!guestId || !newUserId) throw new Error('Guest ID and new user ID are required');
  if (guestId === newUserId) throw new Error('Cannot migrate guest to itself');

  await prisma.$transaction(async (tx) => {
    const guestUser = await tx.user.findUnique({ where: { id: guestId }, select: { role: true } });
    if (!guestUser || guestUser.role !== 'GUEST') {
      throw new Error(`User ${guestId} is not a guest user`);
    }

    await tx.quiz.updateMany({
      where: { userId: guestId },
      data: { userId: newUserId }
    });

    const guestStats = await tx.userStats.findUnique({ where: { userId: guestId } });
    if (guestStats) {
      const newUserStats = await tx.userStats.upsert({
        where: { userId: newUserId },
        update: {
          totalQuizzesTaken: guestStats.totalQuizzesTaken,
          totalQuestionsAnswered: guestStats.totalQuestionsAnswered,
          totalCorrectAnswers: guestStats.totalCorrectAnswers,
          rank: guestStats.rank,
          eloRating: guestStats.eloRating
        },
        create: {
          userId: newUserId,
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
