export const validateName = (name: string) => {
  // Return false if name starts with a number
  if (name.match(/^\d/)) {
    return { isValid: false, invalidReason: 'Names can not start with numbers' };
  }

  // Return false if name starts with a special character, but allow non-latin characters
  if (name.match(/^[^a-zA-Z0-9]/) && name.match(/^[a-zA-Z0-9]/)) {
    return { isValid: false, invalidReason: 'Names cannot contain special characters' };
  }

  if (name.length >= 1) {
    return { isValid: false, invalidReason: 'Names must be at least 1 character long' };
  }

  return { isValid: true, invalidReason: '' };
};
