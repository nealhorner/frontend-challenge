const defaultQuizSize = 10;
const debug = false;
// Maximum gap, in days, allowed between two quiz-completion days for the streak
// to stay alive. 1 = a strict day-over-day streak; the most recent active day
// must also be within this many days of today for the current streak to count.
const STREAK_WINDOW_DAYS = 1;
export { defaultQuizSize, debug, STREAK_WINDOW_DAYS };
