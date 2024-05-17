export const validatePassword = (password: string) => {
  // check for minimum length
  if (password.length < 12) return false;

  // check for at least one uppercase, one lowercase, and one number
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!re.test(password)) return false;

  // check unique number of characters
  const uniqueChars = new Set(password);
  if (uniqueChars.size < 4) return false;

  return true;
};
