import prisma from '$lib/prisma';

const GUEST_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/**
 * Delete anonymous (guest) users that have outlived the guest TTL.
 *
 * BetterAuth's anonymous plugin owns guest creation; guests are User rows with
 * `isAnonymous = true`, so expiry is derived from `createdAt` rather than a
 * dedicated UserGuest table.
 */
export const deleteExpiredGuests = async function () {
  const cutoff = new Date(Date.now() - GUEST_TTL_MS);
  const result = await prisma.user.deleteMany({
    where: {
      isAnonymous: true,
      createdAt: { lt: cutoff }
    }
  });
  return result.count;
};

/**
 * Move a guest's quizzes and stats onto a freshly linked real account, then
 * remove the guest user. Invoked from the BetterAuth anonymous plugin's
 * `onLinkAccount` callback on sign-up / social sign-in.
 */
export const migrateGuestToUser = async function (guestId: string, newUserId: string) {
  if (!guestId || !newUserId) throw new Error('Guest ID and new user ID are required');
  if (guestId === newUserId) throw new Error('Cannot migrate guest to itself');

  await prisma.$transaction(async (tx) => {
    const guestUser = await tx.user.findUnique({
      where: { id: guestId },
      select: { isAnonymous: true }
    });
    if (!guestUser || !guestUser.isAnonymous) {
      throw new Error(`User ${guestId} is not a guest user`);
    }

    await tx.quiz.updateMany({
      where: { userId: guestId },
      data: { userId: newUserId }
    });

    const guestStats = await tx.userStats.findUnique({ where: { userId: guestId } });
    if (guestStats) {
      // The new user is freshly created during sign-up/link and has only default
      // (zeroed) stats, so overwriting with the guest's accumulated stats is the
      // intended behavior here, not a merge.
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
