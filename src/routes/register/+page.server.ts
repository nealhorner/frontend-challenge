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

export const load: PageServerLoad = async (event) => {
  // If user is already logged in, redirect to the main page
  if (event.locals.user) {
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
      await prisma.user.create({
        data: {
          id: userId,
          email: email,
          hashedPassword: passwordHash,
          name: email // TODO name be populated here
        }
      });

      await prisma.userDetail.create({
        data: {
          userId: userId
        }
      });

      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, userId);
      setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch (e) {
      return fail(500, { message: 'An error has occurred' });
    }
    return redirect(302, '/');
  }
};
