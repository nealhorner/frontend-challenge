function hasMoreThanTwoSequentialNumbers(input: string): boolean {
  for (let i = 0; i < input.length - 2; i++) {
    // Check if the current, next, and next-next characters are digits
    if (/\d/.test(input[i]) && /\d/.test(input[i + 1]) && /\d/.test(input[i + 2])) {
      // Convert the characters to numbers
      const num1 = parseInt(input[i]);
      const num2 = parseInt(input[i + 1]);
      const num3 = parseInt(input[i + 2]);

      // Check if they form a sequential increasing sequence
      if (num1 + 1 === num2 && num2 + 1 === num3) {
        return true;
      }
    }
  }
  return false;
}

export const validatePassword = (password: string) => {
  // check for minimum length
  if (password.length < 12)
    return { isValid: false, invalidReason: 'Password must be at least 12 characters' };

  // check for for sequential numbers
  if (hasMoreThanTwoSequentialNumbers(password))
    return {
      isValid: false,
      invalidReason: 'Password cannot contain 3 or more sequential numbers'
    };

  // check unique number of characters
  const uniqueChars = new Set(password);
  if (uniqueChars.size < 4)
    return { isValid: false, invalidReason: 'Password must contain at least 4 unique characters' };

  return { isValid: true, invalidReason: null };
};
