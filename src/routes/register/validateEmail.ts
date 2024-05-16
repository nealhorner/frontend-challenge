export const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return { isValid: re.test(email), invalidReason: 'Invalid email' };
};
