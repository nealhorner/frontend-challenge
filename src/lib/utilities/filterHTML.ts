export const filterHTML = (html: string) => {
  // if html contains &lt; or &gt, it's probably not safe
  if (html.includes('&lt;') || html.includes('&gt;')) {
    console.log('Filtering unsafe HTML', html);
    return '';
  }
  return html;
};
