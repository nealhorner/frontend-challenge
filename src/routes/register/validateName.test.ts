import { validateName } from './validateName';
import { expect, describe, it } from 'vitest';

describe('validateName', () => {
  it('should return true for a valid name', () => {
    const name = 'John Doe';
    const result = validateName(name);
    expect(result).toBe(true);
  });

  it('should return false for an empty name', () => {
    const name = '';
    const result = validateName(name);
    expect(result).toBe(false);
  });

  it('should return false for a name with only spaces', () => {
    const name = '   ';
    const result = validateName(name);
    expect(result).toBe(false);
  });

  it('should return false for a name starting with a space', () => {
    const name = ' John Doe';
    const result = validateName(name);
    expect(result).toBe(false);
  });

  it('should return false for a name starting with a number', () => {
    const name = '1 John Doe';
    const result = validateName(name);
    expect(result).toBe(false);
  });

  it('should return false for a name starting with a special character', () => {
    const name = '@John Doe';
    const result = validateName(name);
    expect(result).toBe(false);
  });

  it('should return true for a name starting with a non-latin character', () => {
    const name = '李 John Doe';
    const result = validateName(name);
    expect(result).toBe(true);
  });
});
