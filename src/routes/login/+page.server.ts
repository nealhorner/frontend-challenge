import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Action, Actions } from './$types';
import prisma from '$lib/prisma';

const DELAY_MS = 5000;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const login: Action = async ({ cookies, request }) => {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return fail(400, { invalid: true });
  }

  const email = username; // FIXME this is a hack to make the code work

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    delay(DELAY_MS);
    return fail(400, { credentials: true });
  }

  const isAuthenticated = await bcrypt.compare(password, user.hashedPassword);

  if (!isAuthenticated) {
    delay(DELAY_MS);
    return fail(400, { credentials: true });
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
};

export const actions: Actions = { login };
