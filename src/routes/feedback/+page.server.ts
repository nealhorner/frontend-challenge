import type { PageServerLoad } from './$types';

const VALID_TYPES = ['general', 'bug', 'question'] as const;
type FeedbackType = (typeof VALID_TYPES)[number];

export const load: PageServerLoad = async ({ locals, url }) => {
  const typeParam = url.searchParams.get('type');
  const initialType: FeedbackType = (VALID_TYPES as readonly string[]).includes(typeParam ?? '')
    ? (typeParam as FeedbackType)
    : 'general';

  return {
    userEmail: locals.user?.email ?? null,
    initialType,
    initialQuestionId: url.searchParams.get('questionId') ?? ''
  };
};
