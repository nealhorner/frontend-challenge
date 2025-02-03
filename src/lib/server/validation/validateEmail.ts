export const validateEmail = (email: string | undefined) => {
  // Simple email validation, not fully compliant
  // Users should verify their email

  if (!email || email.length < 3 || email.length > 255) {
    return { isValid: false, invalidReason: 'Invalid email' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, invalidReason: 'Invalid email' };
  }
  return { isValid: true, invalidReason: null };
};
