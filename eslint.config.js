import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import path from 'path';

export default [
    {
        ignores: ['**/dist/**', '**/.expo/**', '**/node_modules/**'],
    },
    {
        files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
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
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": "error",
            "react-hooks/set-state-in-effect": "off"
        },
    },
    prettier,
];