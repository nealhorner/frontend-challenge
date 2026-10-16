import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoisted so the mock factory below can reference it before the handler imports
const prisma = vi.hoisted(() => ({
  quiz: { findUnique: vi.fn(), findUniqueOrThrow: vi.fn(), updateMany: vi.fn() },
  quizQuestion: { findUnique: vi.fn(), count: vi.fn(), update: vi.fn() },
  question: { findUnique: vi.fn() },
  // Post-quiz tasks; only checked for whether they ran
  userStats: { upsert: vi.fn(() => new Promise(() => {})) }
}));

vi.mock('$lib/prisma', () => ({ default: prisma }));
vi.mock('$lib/eloRating', () => ({ updateEloRankings: vi.fn() }));

import { POST } from './+server';

const savedRecord = {
  quizId: 'quiz_1',
  questionId: 'q_1',
  answer: 'p',
  isAnswered: true,
  isCorrect: true,
  askedTimestamp: null,
  answeredTimestamp: '2026-10-16T00:00:00.000Z'
};

function submit(body: Record<string, unknown>, userId: string | null = 'user_1') {
  const request = new Request('http://localhost/api/quiz/questions', {
    method: 'POST',
    body: JSON.stringify(body)
  });
  // Only the fields the handler reads
  const event = { request, locals: { user: userId ? { id: userId } : undefined } };
  return POST(event as unknown as Parameters<typeof POST>[0]);
}

describe('POST /api/quiz/questions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects a request without a session', async () => {
    const response = await submit({ quizId: 'quiz_1', questionId: 'q_1' }, null);
    expect(response.status).toBe(401);
  });

  it('returns the saved record when an answered question is submitted again', async () => {
    prisma.quiz.findUnique.mockResolvedValue({ userId: 'user_1', isCompleted: false });
    prisma.quizQuestion.findUnique.mockResolvedValue(savedRecord);
    prisma.quizQuestion.count.mockResolvedValue(3);

    const response = await submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'other' });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(savedRecord);
    // The first answer stands
    expect(prisma.quizQuestion.update).not.toHaveBeenCalled();
  });

  it('accepts a retry of the final answer after the quiz was completed', async () => {
    prisma.quiz.findUnique.mockResolvedValue({ userId: 'user_1', isCompleted: true });
    prisma.quizQuestion.findUnique.mockResolvedValue(savedRecord);

    const response = await submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'p' });

    expect(response.status).toBe(200);
    expect(prisma.quizQuestion.update).not.toHaveBeenCalled();
    expect(prisma.quiz.updateMany).not.toHaveBeenCalled();
  });

  describe('retry of the final answer on a quiz that was never marked complete', () => {
    beforeEach(() => {
      prisma.quiz.findUnique.mockResolvedValue({ userId: 'user_1', isCompleted: false });
      prisma.quizQuestion.findUnique.mockResolvedValue(savedRecord);
      prisma.quizQuestion.count.mockResolvedValue(0);
      prisma.quiz.findUniqueOrThrow.mockResolvedValue({
        id: 'quiz_1',
        userId: 'user_1',
        quizQuestions: [{ ...savedRecord }, { ...savedRecord, questionId: 'q_2', isCorrect: false }]
      });
    });

    it('completes and scores the quiz before returning success', async () => {
      prisma.quiz.updateMany.mockResolvedValue({ count: 1 });

      const response = await submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'p' });

      expect(response.status).toBe(200);
      expect(prisma.quiz.updateMany).toHaveBeenCalledWith({
        where: { id: 'quiz_1', isCompleted: false },
        data: { isCompleted: true, score: 10 }
      });
      expect(prisma.userStats.upsert).toHaveBeenCalledTimes(1);
    });

    it('does not report success when completing the quiz fails', async () => {
      prisma.quiz.updateMany.mockRejectedValue(new Error('db down'));

      await expect(
        submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'p' })
      ).rejects.toThrow('db down');
    });

    it('skips post-quiz tasks when another request already completed it', async () => {
      prisma.quiz.updateMany.mockResolvedValue({ count: 0 });

      const response = await submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'p' });

      expect(response.status).toBe(200);
      expect(prisma.userStats.upsert).not.toHaveBeenCalled();
    });
  });

  it('still rejects an unanswered question on a completed quiz', async () => {
    prisma.quiz.findUnique.mockResolvedValue({ userId: 'user_1', isCompleted: true });
    prisma.quizQuestion.findUnique.mockResolvedValue({ ...savedRecord, isAnswered: false });

    const response = await submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'p' });

    expect(response.status).toBe(400);
  });

  it('does not reveal whether another user has answered their question', async () => {
    prisma.quiz.findUnique.mockResolvedValue({ userId: 'someone_else', isCompleted: false });

    const response = await submit({ quizId: 'quiz_1', questionId: 'q_1', userAnswer: 'p' });

    expect(response.status).toBe(403);
    expect(prisma.quizQuestion.findUnique).not.toHaveBeenCalled();
  });
});
