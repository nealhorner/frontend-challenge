// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/auth').SessionUser | null;
      session: import('$lib/auth').Session | null;
      isAuthenticated: boolean;
    }
  }
}

export {};
