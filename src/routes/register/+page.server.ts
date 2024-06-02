import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';
import { validatePassword } from './validatePassword';
import { delayAndFail, createEmptyAuthErrorObject } from '$lib/auth/auth-utilities';

const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email } });
};

const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    let name = data.get('name');
    let email = data.get('email');
    let password = data.get('password');

    const errorResponse = createEmptyAuthErrorObject();
    let statusCode = 201;

    if (!isString(name)) {
      errorResponse.error.name = 'Invalid name';
      statusCode = 400;
      return delayAndFail(errorResponse, statusCode);
    }
    if (!isString(email)) {
      errorResponse.error.email = 'Invalid email';
      statusCode = 400;
      return delayAndFail(errorResponse, statusCode);
    }
    if (!isString(password)) {
      errorResponse.error.password = 'Invalid password';
      statusCode = 400;
      return delayAndFail(errorResponse, statusCode);
    }

    // Sanitize inputs
    name = name.trim();
    email = email.trim();
    password = password.trim();

    const userFound = await findUserByEmail(email);
    if (userFound) {
      errorResponse.error.email = 'Email already in use';
      statusCode = 409;
    }

    const { isValid: emailIsValid, invalidReason: emailInvalidReason } = validateEmail(email);
    if (!emailIsValid) {
      errorResponse.error.email = emailInvalidReason;
      statusCode = 400;
    }

    const { isValid: passwordIsValid, invalidReason: passwordInvalidReason } =
      validatePassword(password);
    if (!passwordIsValid) {
      errorResponse.error.password = passwordInvalidReason;
      statusCode = 400;
    }

    let { isValid: nameIsValid, invalidReason: nameInvalidReason } = validateName(name);
    if (!nameIsValid) {
      errorResponse.error.name = nameInvalidReason;
      statusCode = 400;
    }

    if (statusCode !== 201) {
      return delayAndFail(errorResponse, statusCode);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      hashedPassword
    };

    await prisma.user.create({ data: user });
    console.log('User created:', user.name, user.email);
    redirect(303, '/login');
  }
};
