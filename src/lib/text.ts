// The entities scraped descriptions actually use: markup characters plus
// common typography. Numeric references (&#8212;) cover anything else.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  laquo: '«',
  raquo: '»',
  bull: '•',
  middot: '·',
  copy: '©',
  reg: '®',
  trade: '™',
  deg: '°',
  times: '×',
  rarr: '→',
  larr: '←'
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const hex = entity[1].toLowerCase() === 'x';
      const code = parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/**
 * Turn scraped HTML (e.g. an OpenGraph description) into plain text: decode
 * entities, drop tags, and collapse whitespace. Decoding first means escaped
 * markup such as `&lt;a href=…&gt;` is removed too. Render the result as text,
 * never with {@html}.
 */
export function toPlainText(html: string): string {
  return (
    decodeEntities(html)
      // Only tag-shaped text: `<` followed by a letter, `/` or `!` (comments).
      // Plain comparisons such as "1 < 2 and 3 > 0" are kept.
      .replace(/<!--[\s\S]*?-->|<\/?[a-z][^<>]*>/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}
