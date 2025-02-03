import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
  // If user is already logged in, redirect to the main page
  if (event.locals.user) {
    console.log('User is already logged in', event.locals);
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

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/');
  },
  register: async (event) => {
    // TODO split login and register into separate files
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

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

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, userId);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch (e) {
      return fail(500, { message: 'An error has occurred' });
    }
    return redirect(302, '/');
  }
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

function validateName(name: unknown): name is string {
  //TODO more robust name validation
  return (
    typeof name === 'string' && name.length >= 3 && name.length <= 31 && /^[a-z0-9_-]+$/.test(name)
  );
}

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length >= 3 && email.length <= 255; // TODO more robust email validation
}

function validatePassword(password: unknown): password is string {
  //TODO more robust password validation
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

//TODO remove this
// export const actions: Actions = {
//   default: async ({ cookies, request }) => {
//     const data = await request.formData();
//     const email = data.get('email');
//     const password = data.get('password');

//     const errorResponse = createEmptyAuthErrorObject();

//     if (typeof email !== 'string' || !email) {
//       errorResponse.error.email = 'Invalid email';
//       return delayAndFail(errorResponse, 400);
//     }

//     if (typeof password !== 'string' || !password) {
//       errorResponse.error.password = 'Invalid password';
//       return delayAndFail(errorResponse, 400);
//     }

//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       errorResponse.error.other = 'Invalid email or password';
//       return delayAndFail(errorResponse, 400);
//     }

//     const isAuthenticated = await bcrypt.compare(password, user.hashedPassword);

//     if (!isAuthenticated) {
//       errorResponse.error.other = 'Invalid email or password';
//       return delayAndFail(errorResponse, 400);
//     }

//     // generate new auth token just in case
//     const authenticatedUser = await prisma.user.update({
//       where: { email: user.email },
//       data: { authToken: crypto.randomUUID() }
//     });

//     if (authenticatedUser.authToken) {
//       cookies.set('session', authenticatedUser.authToken, {
//         path: '/',
//         httpOnly: true,
//         sameSite: 'strict',
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 60 * 60 * 24 * 30
//       });
//     }

//     redirect(302, '/');
//   }
// };
