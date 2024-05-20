export const decodeHTML = function (encodedHTML: string) {
  // Simple HTML decoding. This may not have full coverage.

  const htmlEntities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#34;': '"',
    '&#039;': "'",
    '&ndash;': '-',
    '&copy;': '©',
    '&reg;': '®',
    '&apos;': "'", // cspell:disable-line
    '&trade;': '™'
  };

  const decodedHTML = encodedHTML.replace(/&[\w#]+;/g, (entity) => {
    return htmlEntities[entity] || entity;
  });
  return decodedHTML;
};
