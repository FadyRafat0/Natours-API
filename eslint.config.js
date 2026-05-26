import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-console': 'error',
            'no-unused-vars': [
                'warn',
                { argsIgnorePattern: 'req|res|next|val' },
            ],
            'prefer-destructuring': ['warn', { object: true, array: false }],
            'consistent-return': 'off',
            'func-names': 'off',
            'object-shorthand': 'off',
            'no-process-exit': 'off',
            'no-param-reassign': 'off',
            'no-return-await': 'off',
            'no-underscore-dangle': 'off',
            'class-methods-use-this': 'off',
        },
    },
];
