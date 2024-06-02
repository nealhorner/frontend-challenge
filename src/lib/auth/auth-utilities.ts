import { fail } from '@sveltejs/kit';

const DELAY_MS = 2000;

export const delayAndFail = async (message: object, status: number) => {
  await new Promise((res) => setTimeout(res, DELAY_MS));
  return fail(status, { ok: false, error: message });
};

interface AuthErrorObject {
  error: {
    generic: string | null;
    email: string | null;
    name: string | null;
    password: string | null;
    other: string | null;
  };
}

// create a function to generate a new AuthErrorObject with all fields set to empty strings
export const createEmptyAuthErrorObject = (): AuthErrorObject => {
  return { error: { generic: '', email: '', name: '', password: '', other: '' } };
};
