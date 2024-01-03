module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['./**/*.{ts,tsx}'],
      rules: {
      }
    },
    {
      files: ['./**/*.tsx'],
      rules:
        {
          '@typescript-eslint/explicit-function-return-type': 'off'
        }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    quotes: ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'always']
  }
};
