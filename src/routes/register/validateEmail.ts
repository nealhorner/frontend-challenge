export const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  if (re.test(email)) {
    return { isValid: re.test(email), invalidReason: 'Invalid email' };
  }
  return { isValid: true, invalidReason: '' };
};
