import prisma from '$lib/prisma';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, parent }) => {
  // Check that the user is authenticated
  const { isAuthenticated } = await parent();
  if (!isAuthenticated || !locals.user) {
    throw error(403, {
      message: 'Unauthorized'
    });
  }

  const userId = locals.user.id;

  // Get the user from the session
  const userNested = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      UserAuthenticated: {
        include: {
          UserDetail: true
        },
        omit: {
          hashedPassword: true
        }
      },
      UserStats: true
    }
  });

  if (
    !userNested ||
    !userNested.UserStats ||
    !userNested.UserAuthenticated ||
    userNested.UserAuthenticated.UserDetail === null
  ) {
    console.warn('User or related data not found');
    return redirect(302, '/');
  }

  const { UserStats, UserAuthenticated, ...user } = userNested;
  const { UserDetail, ...userAuthenticated } = UserAuthenticated;

  if (!UserDetail) {
    console.warn('User or related data not found');
    return redirect(302, '/');
  }

  return { user, userAuthenticated, userDetail: UserDetail, userStats: UserStats };
};

export const actions: Actions = {
  deleteAccount: async (event) => {
    console.log('deleteAccount', event.locals.user);

    if (!event.locals.user || !event.locals.session) {
      console.warn('Unauthorized deleteAccount');
      return fail(401, {
        message: 'Unauthorized',
        deleteAccountUnauthorized: true
      });
    }
    const userId = event.locals.user.id;

    // Check that email matches
    const formData = await event.request.formData();
    const email = formData.get('email');
    const user = await prisma.userAuthenticated.findUnique({
      where: {
        userId: userId
      }
    });

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

    // Delete the user and associated data
    await prisma.$transaction([
      prisma.userSession.delete({ where: { userId: userId } }),
      prisma.userDetail.delete({ where: { userId: userId } }),
      prisma.userAuthenticated.delete({ where: { userId: userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);
    auth.deleteSessionTokenCookie(event);

    console.log('Successfully deleted user', userId);

    // On success, redirect to the homepage
    return redirect(302, '/');
  }
};
