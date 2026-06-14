import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Pass the isAuthenticated flag to the client layout
  return {
    isAuthenticated: event.locals.isAuthenticated
  };
};
