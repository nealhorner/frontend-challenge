import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';
import { validatePassword } from './validatePassword';

interface ErrorObject {
  email: string | null;
  name: string | null;
  password: string | null;
  other: string | null;
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
    let name = data.get('name');
    let email = data.get('email');
    let password = data.get('password');

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

    // Sanitize inputs
    name = name.trim();
    email = email.trim();
    password = password.trim();

    const userFound = await findUserByEmail(email);
    if (userFound) {
      errorResponse.email = 'Email already in use';
      statusCode = 409;
    }

    const { isValid: emailIsValid, invalidReason: emailInvalidReason } = validateEmail(email);
    if (!emailIsValid) {
      errorResponse.email = emailInvalidReason;
      statusCode = 400;
    }

    const { isValid: passwordIsValid, invalidReason: passwordInvalidReason } =
      validatePassword(password);
    if (!passwordIsValid) {
      errorResponse.password = passwordInvalidReason;
      statusCode = 400;
    }

    let { isValid: nameIsValid, invalidReason: nameInvalidReason } = validateName(name);
    if (!nameIsValid) {
      errorResponse.name = nameInvalidReason;
      statusCode = 400;
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
