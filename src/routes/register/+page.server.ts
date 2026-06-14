import prisma from '$lib/prisma';
import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateEmail, validateName, validatePassword } from '$lib/server/validation/';
import {
  createSession,
  generateUserId,
  generateSessionToken,
  setSessionTokenCookie
} from '$lib/server/auth';
import { migrateGuestToUser } from '$lib/server/userGuest';

export const load: PageServerLoad = async (event) => {
  // If user is already logged in, redirect to the main page
  if (event.locals.isAuthenticated) {
    console.log('User is already logged in');
    return redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!validateEmail(email)) {
      return fail(400, { message: 'Invalid email', loginError: true });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password', loginError: true });
    }
    if (!validateName(name)) {
      return fail(400, { message: 'Invalid name', loginError: true });
    }

    const userId = generateUserId();
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    try {
      // Create a new authenticated user in the database with related records
      await prisma.user.create({
        data: {
          id: userId,
          role: 'USER',
          UserAuthenticated: {
            create: {
              email: email,
              hashedPassword: passwordHash,
              name: name,
              UserDetail: {
                create: {}
              }
            }
          },
          UserStats: {
            create: {}
          }
        }
      });

      if (event.locals.user?.id) {
        const guestUser = await prisma.user.findUnique({
          where: { id: event.locals.user.id, role: 'GUEST' }
        });

        if (guestUser) {
          await migrateGuestToUser(guestUser.id, userId);
        }
      }

      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, userId);
      setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return redirect(302, '/');
  }
};
