import { computeStreaks } from './streak';
import { expect, describe, it } from 'vitest';

// Helper to build a UTC-midnight date from a YYYY-MM-DD string.
const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe('computeStreaks', () => {
  it('returns zero streaks when there is no activity', () => {
    expect(computeStreaks([], 1, day('2026-06-14'))).toEqual({
      currentStreak: 0,
      longestStreak: 0
    });
  });

  it('counts a single active day as a streak of 1', () => {
    expect(computeStreaks([day('2026-06-14')], 1, day('2026-06-14'))).toEqual({
      currentStreak: 1,
      longestStreak: 1
    });
  });

  it('counts consecutive days ending today', () => {
    const dates = [day('2026-06-12'), day('2026-06-13'), day('2026-06-14')];
    expect(computeStreaks(dates, 1, day('2026-06-14'))).toEqual({
      currentStreak: 3,
      longestStreak: 3
    });
  });

  it('keeps the current streak alive when the latest day is yesterday', () => {
    const dates = [day('2026-06-12'), day('2026-06-13')];
    expect(computeStreaks(dates, 1, day('2026-06-14')).currentStreak).toBe(2);
  });

  it('resets the current streak when the gap to today exceeds the window', () => {
    const dates = [day('2026-06-10'), day('2026-06-11')];
    const result = computeStreaks(dates, 1, day('2026-06-14'));
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(2);
  });

  it('breaks the streak on a gap larger than the window', () => {
    const dates = [day('2026-06-10'), day('2026-06-13'), day('2026-06-14')];
    expect(computeStreaks(dates, 1, day('2026-06-14'))).toEqual({
      currentStreak: 2,
      longestStreak: 2
    });
  });

  it('dedupes multiple quizzes on the same day', () => {
    const dates = [day('2026-06-14'), day('2026-06-14'), day('2026-06-13')];
    expect(computeStreaks(dates, 1, day('2026-06-14'))).toEqual({
      currentStreak: 2,
      longestStreak: 2
    });
  });

  it('honours a larger window allowing gaps between active days', () => {
    const dates = [day('2026-06-10'), day('2026-06-12'), day('2026-06-14')];
    expect(computeStreaks(dates, 2, day('2026-06-14'))).toEqual({
      currentStreak: 3,
      longestStreak: 3
    });
  });

  it('reports the longest streak even when it is in the past', () => {
    const dates = [
      day('2026-06-01'),
      day('2026-06-02'),
      day('2026-06-03'),
      day('2026-06-13'),
      day('2026-06-14')
    ];
    expect(computeStreaks(dates, 1, day('2026-06-14'))).toEqual({
      currentStreak: 2,
      longestStreak: 3
    });
  });
});
