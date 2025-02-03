import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
  // If user is already logged in, redirect to the main page
  if (event.locals.user) {
    console.log('User is already logged in');
    return redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return fail(400, { message: 'Incorrect email or password', loginError: true });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!existingUser) {
      return fail(400, { message: 'Incorrect email or password', loginError: true });
    }

    const validPassword = await verify(existingUser.hashedPassword, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    if (!validPassword) {
      return fail(400, { message: 'Incorrect email or password', loginError: true });
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/');
  }
};

// function validateName(name: unknown): name is string {
//   //TODO more robust name validation
//   return (
//     typeof name === 'string' && name.length >= 3 && name.length <= 31 && /^[a-z0-9_-]+$/.test(name)
//   );
// }

// function validateEmail(email: unknown): email is string {
//   return typeof email === 'string' && email.length >= 3 && email.length <= 255; // TODO more robust email validation
// }

// function validatePassword(password: unknown): password is string {
//   //TODO more robust password validation
//   return typeof password === 'string' && password.length >= 6 && password.length <= 255;
// }
