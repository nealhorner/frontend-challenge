import { validateEmail } from './validateEmail';
import { expect, describe, it } from 'vitest';

describe('validateEmail', () => {
  it('should return true for a valid email', () => {
    const email = 'test@example.com';
    const result = validateEmail(email);
    expect(result.isValid).toBe(true);
    expect(result.invalidReason).toBeUndefined();
  });

  it('should return false for an invalid email', () => {
    const email = 'invalidemail';
    const result = validateEmail(email);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Invalid email');
  });

  it('should return false for an empty email', () => {
    const email = '';
    const result = validateEmail(email);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Invalid email');
  });

  it('should return false for an email with spaces', () => {
    const email = 'test @example.com';
    const result = validateEmail(email);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Invalid email');
  });

  it('should return false for an email with multiple @ symbols', () => {
    const email = 'test@@example.com';
    const result = validateEmail(email);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Invalid email');
  });
});
