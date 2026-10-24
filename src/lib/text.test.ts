import { describe, expect, it } from 'vitest';
import { toPlainText } from './text';

describe('toPlainText', () => {
  it('leaves plain text alone', () => {
    expect(toPlainText('A blog by Dan Abramov')).toBe('A blog by Dan Abramov');
  });

  it('removes tags', () => {
    expect(toPlainText('Follow <a href="https://example.com">@jen</a> today')).toBe(
      'Follow @jen today'
    );
  });

  it('removes escaped tags', () => {
    expect(toPlainText('Follow &lt;a href="https://example.com"&gt;@jen&lt;/a&gt;')).toBe(
      'Follow @jen'
    );
  });

  it('decodes named and numeric entities', () => {
    expect(toPlainText('Tips &amp; tricks &#8212; it&#39;s &#x2192; fun')).toBe(
      "Tips & tricks — it's → fun"
    );
  });

  it('never returns markup that could run as HTML', () => {
    expect(toPlainText('<img src=x onerror="alert(1)">Hi<script>alert(1)</script>')).not.toMatch(
      /<|>/
    );
  });

  it('collapses whitespace', () => {
    expect(toPlainText('  one\n\n  two  ')).toBe('one two');
  });

  it('keeps unknown entities as written', () => {
    expect(toPlainText('&notanentity; and &#99999999;')).toBe('&notanentity; and &#99999999;');
  });
});
