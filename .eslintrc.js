module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['./**/*.tsx'],
      rules:
        {
          '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'max-len': 'warn',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
    }],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
  },
  ignorePatterns: ['./**/*.d.ts', './**/nodecg/external/*'],
};
