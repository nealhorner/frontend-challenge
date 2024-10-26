import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import prisma from '$lib/prisma';
import { delayAndFail, createEmptyAuthErrorObject } from '$lib/auth/auth-utilities';

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const errorResponse = createEmptyAuthErrorObject();

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
      errorResponse.error.other = 'Invalid email or password';
      return delayAndFail(errorResponse, 400);
    }

    const isAuthenticated = await bcrypt.compare(password, user.hashedPassword);

    if (!isAuthenticated) {
      errorResponse.error.other = 'Invalid email or password';
      return delayAndFail(errorResponse, 400);
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

    redirect(302, '/');
  }
};
