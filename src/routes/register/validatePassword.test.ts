import { validatePassword } from './validatePassword';
import { expect, describe, it } from 'vitest';

describe('validatePassword', () => {
  it('should return true for a valid password', () => {
    const password = 'password1324';
    const result = validatePassword(password);
    expect(result.isValid).toBe(true);
    expect(result.invalidReason).toBeNull();
  });

  it('should return false for a password less than 12 characters', () => {
    const password = 'short';
    const result = validatePassword(password);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Password must be at least 12 characters');
  });

  it('should return true for a password that is 12 characters', () => {
    const password = 'shortshortsh'; // cspell:disable-line
    const result = validatePassword(password);
    expect(result.isValid).toBe(true);
    expect(result.invalidReason).toBeNull();
  });

  it('should return false for a password with sequential numbers', () => {
    const password = 'passwordd123'; // cspell:disable-line
    const result = validatePassword(password);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Password cannot contain 3 or more sequential numbers');
  });

  it('should return true for nonadjacent sequential numbers', () => {
    const password = '1pa2ss3wo4rd5';
    const result = validatePassword(password);
    expect(result.isValid).toBe(true);
    expect(result.invalidReason).toBeNull();
  });

  it('should return true for a password with 2 sequential numbers', () => {
    const password = 'passworddddd12';
    const result = validatePassword(password);
    expect(result.isValid).toBe(true);
    expect(result.invalidReason).toBeNull();
  });

  it('should return false for a password with less than 4 unique characters', () => {
    const password = '130000000000000000';
    const result = validatePassword(password);
    expect(result.isValid).toBe(false);
    expect(result.invalidReason).toBe('Password must contain at least 4 unique characters');
  });
});
