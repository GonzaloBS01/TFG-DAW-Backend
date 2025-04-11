import globals from 'globals';
import pluginJs from '@eslint/js';
import babelParser from '@babel/eslint-parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            parser: babelParser,
            globals: {
                ...globals.node,
                ...globals.jest,
                fetch: 'readonly',
            },
        },
        rules: {
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            'no-unused-vars': ['warn'],
            'prefer-const': ['warn'],
            'no-multi-spaces': [
                'error',
                {
                    exceptions: {
                        Property: false,
                    },
                },
            ],
            'keyword-spacing': ['error'],
            'space-before-blocks': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'prefer-template': ['error'],
            'semi': ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
        },
    },
];
