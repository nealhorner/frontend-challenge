import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Prisma client used inside the transaction.
const tx = {
  user: { findUnique: vi.fn(), delete: vi.fn() },
  quiz: { updateMany: vi.fn() },
  userStats: { findUnique: vi.fn(), upsert: vi.fn() },
  userStatsTrends: { updateMany: vi.fn() }
};

vi.mock('$lib/prisma', () => ({
  default: {
    $transaction: vi.fn(async (cb: (t: typeof tx) => unknown) => cb(tx))
  }
}));

import { migrateGuestToUser } from './userGuest';

describe('migrateGuestToUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('moves quizzes and stats from the guest to the new user, then deletes the guest', async () => {
    tx.user.findUnique.mockResolvedValue({ isAnonymous: true });
    tx.userStats.findUnique.mockResolvedValue({
      id: 'stats_guest',
      totalQuizzesTaken: 3,
      totalQuestionsAnswered: 10,
      totalCorrectAnswers: 7,
      rank: 0,
      eloRating: 1000
    });
    tx.userStats.upsert.mockResolvedValue({ id: 'stats_new' });

    await migrateGuestToUser('guest_1', 'user_1');

    expect(tx.quiz.updateMany).toHaveBeenCalledWith({
      where: { userId: 'guest_1' },
      data: { userId: 'user_1' }
    });
    expect(tx.userStats.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user_1' } })
    );
    expect(tx.userStatsTrends.updateMany).toHaveBeenCalledWith({
      where: { userStatsId: 'stats_guest' },
      data: { userStatsId: 'stats_new' }
    });
    expect(tx.user.delete).toHaveBeenCalledWith({ where: { id: 'guest_1' } });
  });

  it('still deletes the guest when it has no stats', async () => {
    tx.user.findUnique.mockResolvedValue({ isAnonymous: true });
    tx.userStats.findUnique.mockResolvedValue(null);

    await migrateGuestToUser('guest_1', 'user_1');

    expect(tx.userStats.upsert).not.toHaveBeenCalled();
    expect(tx.user.delete).toHaveBeenCalledWith({ where: { id: 'guest_1' } });
  });

  it('throws when the source user is not anonymous', async () => {
    tx.user.findUnique.mockResolvedValue({ isAnonymous: false });
    await expect(migrateGuestToUser('user_x', 'user_1')).rejects.toThrow('is not a guest user');
    expect(tx.user.delete).not.toHaveBeenCalled();
  });

  it('rejects migrating a guest onto itself', async () => {
    await expect(migrateGuestToUser('same', 'same')).rejects.toThrow('itself');
  });

  it('requires both ids', async () => {
    await expect(migrateGuestToUser('', 'user_1')).rejects.toThrow('required');
  });
});
