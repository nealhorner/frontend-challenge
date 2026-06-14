import prisma from '$lib/prisma';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth';

export const load: PageServerLoad = async ({ locals, parent }) => {
  // Check that the user is authenticated
  const { isAuthenticated } = await parent();
  if (!isAuthenticated || !locals.user) {
    throw error(403, {
      message: 'Unauthorized'
    });
  }

  const userId = locals.user.id;

  // Get the user along with their profile detail and stats.
  const userNested = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      UserDetail: true,
      UserStats: true
    }
  });

  if (!userNested || !userNested.UserStats || !userNested.UserDetail) {
    console.warn('User or related data not found');
    return redirect(302, '/');
  }

  const { UserStats, UserDetail, ...user } = userNested;

  // Preserve the previous `userAuthenticated` shape the template consumes; the
  // email/name now live on the User record.
  const userAuthenticated = {
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified
  };

  return { user, userAuthenticated, userDetail: UserDetail, userStats: UserStats };
};

export const actions: Actions = {
  deleteAccount: async (event) => {
    if (!event.locals.user || !event.locals.session) {
      console.warn('Unauthorized deleteAccount');
      return fail(401, {
        message: 'Unauthorized',
        deleteAccountUnauthorized: true
      });
    }
    const userId = event.locals.user.id;

    // Check that the typed email matches the account email
    const formData = await event.request.formData();
    const email = formData.get('email');
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.warn('Unauthorized deleteAccount');
      return fail(401, {
        message: 'Unauthorized',
        deleteAccountUnauthorized: true
      });
    }

    if (email !== user.email) {
      return fail(400, {
        message: 'Email does not match',
        deleteAccountIncorrectEmail: true
      });
    }

    // Revoke the session (clears the cookie) then delete the user. Related
    // records (sessions, accounts, stats, detail, quizzes) cascade away.
    await auth.api.signOut({ headers: event.request.headers });
    await prisma.user.delete({ where: { id: userId } });

    console.log('Successfully deleted user', userId);

    // On success, redirect to the homepage
    return redirect(302, '/');
  }
};
