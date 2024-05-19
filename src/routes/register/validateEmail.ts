export const validateEmail = (email: string) => {
  // Simple email validation, not fully compliant
  // Users should verify their email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, invalidReason: 'Invalid email' };
  }
  return { isValid: true, invalidReason: null };
};
