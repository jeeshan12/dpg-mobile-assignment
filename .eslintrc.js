module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'wdio'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:wdio/recommended',
    'prettier',
  ],
  env: {
    node: true,
    es2022: true,
    mocha: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    'reports/',
    'apps/',
    'chromedriver-mobile/',
    'dist/',
    'build/',
    '*.js',
  ],
};

