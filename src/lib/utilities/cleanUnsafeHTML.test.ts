import { cleanUnsafeHTML } from './cleanUnsafeHTML';
import { describe, it, expect } from 'vitest';

describe('cleanUnsafeHTML', () => {
  it('should return an empty string when passed an empty string', () => {
    const result = cleanUnsafeHTML('');
    expect(result).toBe('');
  });

  it('should return the same string when passed a safe HTML string', () => {
    const safeHTML = '<p>This is a safe HTML string.</p>';
    const result = cleanUnsafeHTML(safeHTML);
    expect(result).toBe(safeHTML);
  });

  it('should remove unsafe HTML tags when passed an unsafe HTML string', () => {
    const unsafeHTML = '<script>alert("This is an unsafe script.");</script>';
    const result = cleanUnsafeHTML(unsafeHTML);
    expect(result).toBe('');
  });

  it('should remove unsafe attributes when passed an unsafe HTML string', () => {
    const unsafeHTML = '<p onclick="alert(\'This is an unsafe attribute.\')">Click me</p>';
    const result = cleanUnsafeHTML(unsafeHTML);
    expect(result).toBe('<p>Click me</p>');
  });

  it('should remove unsafe inline styles when passed an unsafe HTML string', () => {
    const unsafeHTML = '<p style="color: red;">This is an unsafe inline style.</p>';
    const result = cleanUnsafeHTML(unsafeHTML);
    expect(result).toBe('<p>This is an unsafe inline style.</p>');
  });
});
