import type { Prisma } from '@prisma/client';
import prisma from '$lib/prisma';

// Fields that are safe to send to the client. Anything not listed here —
// notably `answers` — stays on the server, where answers are graded.
export const publicQuestionSelect = {
  id: true,
  family: true,
  title: true,
  prompt: true,
  type: true,
  multipleChoiceOptions: true,
  tags: true
} satisfies Prisma.QuestionSelect;

export type PublicQuestion = Prisma.QuestionGetPayload<{ select: typeof publicQuestionSelect }>;
export type PrivateQuestion = Prisma.QuestionGetPayload<object>;

const COUNT_TTL_MS = 60_000;

let cachedCount: number | null = null;
let lastRefresh = 0;
let refreshing: Promise<number> | null = null;

function refreshCount(): Promise<number> {
  refreshing ??= prisma.question
    .count()
    .then((count) => {
      cachedCount = count;
      lastRefresh = Date.now();
      return count;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function getQuestionCount({ fresh = false } = {}): Promise<number> {
  if (fresh || cachedCount === null) return refreshCount();

  if (Date.now() - lastRefresh > COUNT_TTL_MS) {
    refreshCount().catch((error) => {
      console.error('Failed to refresh question count', error);
    });
  }

  return cachedCount;
}

// `findAt` must apply a stable orderBy — without a defined order, the database
// is free to return rows in any sequence, so `skip` wouldn't reliably land on
// a well-distributed random row.
async function pickRandom<T>(findAt: (offset: number) => Promise<T | null>): Promise<T | null> {
  // The cached count can be stale (rows deleted since the last refresh), which
  // can make the offset land past the end. Retry once with a freshly awaited
  // count before concluding there's truly nothing to return.
  for (const fresh of [false, true]) {
    const count = await getQuestionCount({ fresh });
    if (count === 0) continue;

    const question = await findAt(Math.floor(Math.random() * count));
    if (question) return question;
  }
  return null;
}

/** A random question with only client-safe fields. Use this for API responses. */
export function getRandomPublicQuestion(): Promise<PublicQuestion | null> {
  return pickRandom((skip) =>
    prisma.question.findFirst({ select: publicQuestionSelect, orderBy: { id: 'asc' }, skip })
  );
}

/** A random question including its answers. Server-side use only — never send to the client. */
export function getRandomPrivateQuestion(): Promise<PrivateQuestion | null> {
  return pickRandom((skip) => prisma.question.findFirst({ orderBy: { id: 'asc' }, skip }));
}

/** A question by id with only client-safe fields. */
export function getPublicQuestion(id: string): Promise<PublicQuestion | null> {
  return prisma.question.findUnique({ select: publicQuestionSelect, where: { id } });
}
