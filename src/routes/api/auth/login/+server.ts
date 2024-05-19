//FIXME
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcrypt';

const DELAY_MS = 5000;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email } });
};

export async function POST({ request, cookies }) {
  const { email, password } = await request.json();
  const mismatchMessage = 'Invalid email or password';

  const userFound = await findUserByEmail(email);

  if (!userFound) {
    await delay(DELAY_MS);
    return json({ error: mismatchMessage }, { status: 401 });
  }

  if (!bcrypt.compareSync(password, userFound.password)) {
    await delay(DELAY_MS);
    return json({ error: mismatchMessage }, { status: 401 });
  }

  return json({ ok: true, message: 'Login successful' });
}
