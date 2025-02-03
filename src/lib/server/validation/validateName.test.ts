import { validateName } from './validateName';
import { expect, describe, it } from 'vitest';

describe('validateName', () => {
  it('should return true for a valid name', () => {
    const name = 'John Doe';
    const result = validateName(name);
    expect(result.invalidReason).toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('should return false for an empty name', () => {
    const name = '';
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names must be at least 1 character long');
    expect(result.isValid).toBe(false);
  });

  it('should return false for a name longer than 50 characters', () => {
    const name = 'John Doe'.repeat(10);
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names cannot be more than 50 characters long');
    expect(result.isValid).toBe(false);
  });

  it('should return false for a name with only spaces', () => {
    const name = '   ';
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names can not start with a space');
    expect(result.isValid).toBe(false);
  });

  it('should return false for a name starting with a space', () => {
    const name = ' John Doe';
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names can not start with a space');
    expect(result.isValid).toBe(false);
  });

  it('should return false for a name starting with a number', () => {
    const name = '1 John Doe';
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names can not start with numbers');
    expect(result.isValid).toBe(false);
  });

  it('should return false for a name starting with a special character', () => {
    const name = '@John Doe';
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names cannot contain special characters');
    expect(result.isValid).toBe(false);
  });

  it('should return true for a name starting with a non-latin character - chinese ', () => {
    const name = '伟祺';
    const result = validateName(name);
    expect(result.invalidReason).toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('should return true for a name starting with a non-latin character - arabic', () => {
    const name = 'جون باول'; // cspell:disable-line
    const result = validateName(name);
    expect(result.invalidReason).toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('should return false for a name containing an emoji', () => {
    const name = 'John 😁 Doe';
    const result = validateName(name);
    expect(result.invalidReason).toBe('Names cannot contain emojis');
    expect(result.isValid).toBe(false);
  });
});
