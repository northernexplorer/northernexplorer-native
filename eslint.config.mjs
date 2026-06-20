import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import path from 'path';

export default [
    {
        ignores: ['**/dist/**', '**/.expo/**', '**/node_modules/**', 'web-build/**'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            'prettier': prettierPlugin,
            '@typescript-eslint': tsPlugin,
        },
    },
    {
        files: [
            '**/*.{ts,tsx}',
            'apps/**/*.{ts,tsx}',
            'packages/**/*.{ts,tsx}'
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: [
                    path.join(import.meta.dirname, 'apps/*/tsconfig.json'),
                    path.join(import.meta.dirname, 'packages/*/tsconfig.json')
                ],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'prettier': prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            'prettier/prettier': 'error',
        },
    },
    prettierConfig,
];