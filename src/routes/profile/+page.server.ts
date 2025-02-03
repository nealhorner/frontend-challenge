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
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      createdAt: true,
      updatedAt: true,
      email: true,
      name: true,
      eloRating: true
    }
  });

  if (!user) {
    error(400, {
      message: 'User not found'
    });
  }

  // TODO move this into user query above
  const userDetail = await prisma.userDetail.findUnique({
    where: {
      userId: userId
    }
  });

  if (!userDetail) {
    // Backfill UserDetail if it doesn't exist
    await prisma.userDetail.create({
      data: {
        userId: userId
      }
    });
  }

  return { ...user, userDetail };
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

    if (email !== event.locals.user.email) {
      return fail(400, {
        message: 'Email does not match',
        deleteAccountIncorrectEmail: true
      });
    }

    // Delete the user and associated data
    await prisma.userSession.delete({
      where: {
        userId: userId
      }
    });
    await prisma.userDetail.delete({
      where: {
        userId: userId
      }
    });
    await prisma.user.delete({
      where: {
        id: userId
      }
    });
    auth.deleteSessionTokenCookie(event);

    console.log('Successfully deleted user', userId);

    // On success, redirect to the homepage
    return redirect(302, '/');
  }
};
