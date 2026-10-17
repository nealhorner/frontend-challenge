// Light/dark theme. The inline script in src/app.html applies the saved theme
// before first paint; these helpers read and change it afterwards. Colors for
// each theme live in src/lib/styles/tokens.css under [data-theme].

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

// Shows the theme toggle in the header. Off until every page is restyled for
// dark mode (redesign phase 5); flip it together with `followSystem` in
// src/app.html. Until then, preview with localStorage.theme = 'dark'.
export const DARK_MODE_ENABLED = false;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode, disabled site data); the theme
    // still applies for this page view.
  }
}
