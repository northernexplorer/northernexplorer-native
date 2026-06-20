import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import * as jsoncParser from 'jsonc-eslint-parser';
import path from 'path';

export default [
  {
    ignores: ['**/dist/**', '**/.expo/**', '**/node_modules/**', 'web-build/**'],
  },
  // Target pure JS/MJS scripts for Prettier
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  // Dedicated block assigning the proper structural parser to JSON files
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tsPlugin,
    },
  },
  {
    files: ['**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          path.join(import.meta.dirname, 'apps/*/tsconfig.json'),
          path.join(import.meta.dirname, 'packages/*/tsconfig.json'),
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
];
