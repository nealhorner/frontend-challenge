import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const question = { count: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn() };

vi.mock('$lib/prisma', () => ({ default: { question } }));

// The count cache is module state, so each test gets a fresh copy of the module.
async function loadModule() {
  vi.resetModules();
  return import('./questions');
}

describe('question queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getRandomPublicQuestion selects only public fields', async () => {
    const { getRandomPublicQuestion, publicQuestionSelect } = await loadModule();
    question.count.mockResolvedValue(5);
    question.findFirst.mockResolvedValue({ id: 'q1' });

    await getRandomPublicQuestion();

    expect(question.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ select: publicQuestionSelect })
    );
    expect(publicQuestionSelect).not.toHaveProperty('answers');
  });

  it('getRandomPrivateQuestion returns the full row', async () => {
    const { getRandomPrivateQuestion } = await loadModule();
    question.count.mockResolvedValue(5);
    question.findFirst.mockResolvedValue({ id: 'q1', answers: '["p"]' });

    const result = await getRandomPrivateQuestion();

    expect(question.findFirst.mock.calls[0][0]).not.toHaveProperty('select');
    expect(result).toEqual({ id: 'q1', answers: '["p"]' });
  });

  it('caches the count between calls', async () => {
    const { getRandomPublicQuestion } = await loadModule();
    question.count.mockResolvedValue(5);
    question.findFirst.mockResolvedValue({ id: 'q1' });

    await getRandomPublicQuestion();
    await getRandomPublicQuestion();

    expect(question.count).toHaveBeenCalledTimes(1);
  });

  it('shares one count query across concurrent cold-start calls', async () => {
    const { getRandomPublicQuestion } = await loadModule();
    question.count.mockResolvedValue(5);
    question.findFirst.mockResolvedValue({ id: 'q1' });

    await Promise.all([getRandomPublicQuestion(), getRandomPublicQuestion()]);

    expect(question.count).toHaveBeenCalledTimes(1);
  });

  it('serves the stale count while refreshing in the background after the TTL', async () => {
    const { getRandomPublicQuestion } = await loadModule();
    question.count.mockResolvedValueOnce(5);
    question.findFirst.mockResolvedValue({ id: 'q1' });
    await getRandomPublicQuestion();

    vi.advanceTimersByTime(61_000);
    let resolveRefresh!: (count: number) => void;
    question.count.mockReturnValueOnce(new Promise((resolve) => (resolveRefresh = resolve)));

    // Resolves without waiting on the pending refresh
    await expect(getRandomPublicQuestion()).resolves.toEqual({ id: 'q1' });
    expect(question.count).toHaveBeenCalledTimes(2);
    resolveRefresh(5);
  });

  it('retries with a fresh count when a stale offset finds nothing', async () => {
    const { getRandomPublicQuestion } = await loadModule();
    question.count.mockResolvedValueOnce(100).mockResolvedValueOnce(1);
    question.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'q1' });

    await expect(getRandomPublicQuestion()).resolves.toEqual({ id: 'q1' });
    expect(question.count).toHaveBeenCalledTimes(2);
    expect(question.findFirst.mock.calls[1][0].skip).toBe(0);
  });

  it('returns null without querying rows when there are no questions', async () => {
    const { getRandomPublicQuestion } = await loadModule();
    question.count.mockResolvedValue(0);

    await expect(getRandomPublicQuestion()).resolves.toBeNull();
    expect(question.findFirst).not.toHaveBeenCalled();
  });

  it('getPublicQuestion looks up by id with public fields', async () => {
    const { getPublicQuestion, publicQuestionSelect } = await loadModule();
    question.findUnique.mockResolvedValue({ id: 'q1' });

    await getPublicQuestion('q1');

    expect(question.findUnique).toHaveBeenCalledWith({
      select: publicQuestionSelect,
      where: { id: 'q1' }
    });
  });
});
