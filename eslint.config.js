import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default ts.config(
  {
    ignores: ['build/', '.svelte-kit/', 'package/', 'design/', 'test-results/', '*.timestamp-*.mjs']
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  {
    // Added to the recommended sets in eslint-plugin-svelte 3 and typescript-eslint 8.
    // Off for now so the upgrade doesn't change what lint enforces.
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'svelte/no-navigation-without-resolve': 'off',
      'svelte/prefer-writable-derived': 'off',
      'svelte/require-each-key': 'off',
      'svelte/valid-prop-names-in-kit-pages': 'off'
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte']
      }
    }
  }
);
