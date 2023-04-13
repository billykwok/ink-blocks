module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.base.json', 'tsconfig.types.json'],
    sourceType: 'module',
  },
  ignorePatterns: ['/build/**/*'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    indent: 'off',
    'require-jsdoc': 'off',
    'arrow-parens': 'off',
    'new-cap': 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
