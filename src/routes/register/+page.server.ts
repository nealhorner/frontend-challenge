import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';
import { validatePassword } from './validatePassword';

interface ErrorObject {
  email: string;
  name: string;
  password: string;
  other: string;
}

const DELAY_MS = 2000;

const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email } });
};

const delayAndFail = async (message: object, status: number) => {
  await new Promise((res) => setTimeout(res, DELAY_MS));
  return fail(status, { ok: false, error: message });
};

const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');

    const errorResponse: ErrorObject = { name: '', email: '', password: '', other: '' };
    let statusCode = 201;

    if (!isString(name)) {
      errorResponse.name = 'Invalid name';
      statusCode = 400;
      return delayAndFail({ error: errorResponse }, statusCode);
    }
    if (!isString(email)) {
      errorResponse.email = 'Invalid email';
      statusCode = 400;
      return delayAndFail({ error: errorResponse }, statusCode);
    }
    if (!isString(password)) {
      errorResponse.password = 'Invalid password';
      statusCode = 400;
      return delayAndFail({ error: errorResponse }, statusCode);
    }

    const userFound = await findUserByEmail(email);
    if (userFound) {
      errorResponse.email = 'Email already in use';
      statusCode = 409;
    }

    let { isValid, invalidReason } = validateEmail(email);
    if (!isValid) {
      errorResponse.email = invalidReason;
      statusCode = 400;
    }
    if (!validatePassword(password)) {
      return delayAndFail({ password: 'Invalid password' }, 400);
    }
    if (!validateName(name)) {
      return delayAndFail({ name: 'Invalid name' }, 400);
    }

    if (statusCode !== 201) {
      return delayAndFail({ error: errorResponse }, statusCode);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      hashedPassword
    };

    await prisma.user.create({ data: user });
    console.log('User created:', user);
    return { ok: true, status: 201 };
  }
};
