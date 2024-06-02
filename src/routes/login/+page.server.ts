import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import prisma from '$lib/prisma';
import { delayAndFail, createEmptyAuthErrorObject } from '$lib/auth/auth-utilities';

const DELAY_MS = 5000;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    console.log('email:', email);
    const errorResponse = createEmptyAuthErrorObject();
    let statusCode = 200;

    if (typeof email !== 'string' || !email) {
      errorResponse.error.email = 'Invalid email';
      return delayAndFail(errorResponse, 400);
    }

    if (typeof password !== 'string' || !password) {
      errorResponse.error.password = 'Invalid password';
      return delayAndFail(errorResponse, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      delay(DELAY_MS);
      return fail(400, { credentials: true, error: 'User not found' });
    }

    const isAuthenticated = await bcrypt.compare(password, user.hashedPassword);

    if (!isAuthenticated) {
      delay(DELAY_MS);
      return fail(400, { credentials: true, error: 'Invalid password' });
    }

    // generate new auth token just in case
    const authenticatedUser = await prisma.user.update({
      where: { email: user.email },
      data: { authToken: crypto.randomUUID() }
    });

    if (authenticatedUser.authToken) {
      cookies.set('session', authenticatedUser.authToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30
      });
    }

    // redirect the user
    redirect(302, '/');
  }
};
