import stylistic from '@stylistic/eslint-plugin';
import vueParser from 'vue-eslint-parser';

export default [
    {
        files: ['src/**/*.{js,vue}'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            'eol-last': ['error', 'always'],
        },
    },
];
