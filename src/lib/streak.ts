const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Convert a UTC-midnight Date into an integer day index so days can be compared
 * and subtracted without time-of-day or DST noise.
 */
const toDayNumber = (date: Date): number => Math.floor(date.getTime() / MS_PER_DAY);

export interface Streaks {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Compute the user's current and longest streaks from the set of days on which
 * they completed at least one quiz.
 *
 * A streak is a run of active days where the gap between consecutive active days
 * is no greater than `windowDays`. The current streak is only counted when the
 * most recent active day is itself within `windowDays` of `today` (otherwise the
 * streak has lapsed and the current streak is 0).
 *
 * @param activeDates Days (UTC midnight) the user completed a quiz. Order/dupes don't matter.
 * @param windowDays  Max allowed gap between active days (and from today). >= 1.
 * @param today       Reference "now" as a UTC-midnight Date.
 */
export function computeStreaks(activeDates: Date[], windowDays: number, today: Date): Streaks {
  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const window = Math.max(1, Math.floor(windowDays));

  // Dedupe to day granularity and sort ascending.
  const days = [...new Set(activeDates.map(toDayNumber))].sort((a, b) => a - b);

  // Longest streak: walk forward, extending the run while the gap stays within
  // the window, otherwise start a new run.
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] - days[i - 1] <= window ? run + 1 : 1;
    if (run > longestStreak) longestStreak = run;
  }

  // Current streak: only alive if the latest active day is recent enough.
  const todayNumber = toDayNumber(today);
  const latest = days[days.length - 1];
  let currentStreak = 0;
  if (todayNumber - latest <= window) {
    currentStreak = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (days[i] - days[i - 1] <= window) currentStreak++;
      else break;
    }
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}
