import { decodeHTML } from '../utilities/decodeHTML';
import { describe, it, expect } from 'vitest';

describe('decodeHtml', () => {
  it('should decode HTML entities', () => {
    const encodedHTML = '&lt;div&gt;Hello, &amp;world!&lt;/div&gt;';
    const decodedHTML = '<div>Hello, &world!</div>';
    expect(decodeHTML(encodedHTML)).toEqual(decodedHTML);
  });

  it('should handle empty string', () => {
    const encodedHTML = '';
    const decodedHTML = '';
    expect(decodeHTML(encodedHTML)).toEqual(decodedHTML);
  });

  it('should handle HTML without entities', () => {
    const encodedHTML = '<p>This is a paragraph.</p>';
    const decodedHTML = '<p>This is a paragraph.</p>';
    expect(decodeHTML(encodedHTML)).toEqual(decodedHTML);
  });

  it('should handle special characters', () => {
    const encodedHTML = '&copy; &reg; &amp; &lt; &gt; &quot; &apos;';
    const decodedHTML = '© ® & < > " \'';
    expect(decodeHTML(encodedHTML)).toEqual(decodedHTML);
  });

  it('should handle mixed HTML and entities', () => {
    const encodedHTML = '&lt;p&gt;This is a &lt;strong&gt;bold&lt;/strong&gt; statement.&lt;/p&gt;';
    const decodedHTML = '<p>This is a <strong>bold</strong> statement.</p>';
    expect(decodeHTML(encodedHTML)).toEqual(decodedHTML);
  });
});
