export const validateName = (name: string) => {
  // Return false if name starts with a space
  if (name.startsWith(' ')) {
    return false;
  }

  // Return false if name starts with a number
  if (name.match(/^\d/)) {
    return false;
  }

  // Return false if name starts with a special character, but allow non-latin characters
  if (name.match(/^[^a-zA-Z0-9]/) && name.match(/^[a-zA-Z0-9]/)) {
    return false;
  }

  return name.length >= 1;
};
