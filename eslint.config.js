import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
    prettier,
    {
        ignores: ['**/dist/**', '**/.expo/**', '**/node_modules/**'],
    },
    {
        // Target files inside both apps/ and packages/
        files: ['apps/**/*.ts', 'apps/**/*.tsx', 'packages/**/*.ts', 'packages/**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                // Look for tsconfig targets dynamically across both directories
                project: ['./apps/*/tsconfig.json', './packages/*/tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "error",
            "react-hooks/set-state-in-effect": "off",
        },
    }
];