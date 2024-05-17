export const validatePassword = (password: string) => {
  // check for minimum length
  if (password.length < 12) return false;

  // check for for sequential numbers
  if (/\d{3,}/.test(password)) return false;

  // check unique number of characters
  const uniqueChars = new Set(password);
  if (uniqueChars.size < 4) return false;

  return { isValid: true, invalidReason: '' };
};
