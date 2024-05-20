// import createDOMPurify from 'dompurify';
// import { JSDOM } from 'jsdom';

export const cleanUnsafeHTML = function (unsafeHTML: string) {
  return unsafeHTML;
  // let clean = '';
  // try {
  //   const { window } = new JSDOM(`...`);
  //   const DOMPurify = createDOMPurify(window);
  //   clean = DOMPurify.sanitize(unsafeHTML, { FORBID_ATTR: ['style'] });
  // } catch (error) {
  //   console.error(error);
  //   clean = '';
  // }
  // return clean;
};
