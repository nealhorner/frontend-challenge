export const validateName = (name: string) => {
  // name can not start with a space
  if (name.match(/^\s/)) {
    return { isValid: false, invalidReason: 'Names can not start with a space' };
  }

  // Return false if name starts with a number
  if (name.match(/^\d/)) {
    return { isValid: false, invalidReason: 'Names can not start with numbers' };
  }

  // Names can not contain emojis
  if (name.match(/[\u{1F600}-\u{1F64F}]/gu)) {
    return { isValid: false, invalidReason: 'Names cannot contain emojis' };
  }

  // Names can not contain special characters, like !@#$%^&*(), but allow non-latin characters, like chinese or arabic characters
  if (name.match(/[^a-zA-Z0-9\s\u4E00-\u9FA5\u0600-\u06FF]/)) {
    return { isValid: false, invalidReason: 'Names cannot contain special characters' };
  }

  // Names can not be more than 50 characters long
  if (name.length > 50) {
    return { isValid: false, invalidReason: 'Names cannot be more than 50 characters long' };
  }

  if (name.length <= 1) {
    return { isValid: false, invalidReason: 'Names must be at least 1 character long' };
  }

  return { isValid: true, invalidReason: null };
};
