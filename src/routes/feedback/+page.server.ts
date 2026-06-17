import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  return {
    userEmail: locals.user?.email ?? null,
    initialType: (url.searchParams.get('type') ?? 'general') as 'general' | 'bug' | 'question',
    initialQuestionId: url.searchParams.get('questionId') ?? ''
  };
};
