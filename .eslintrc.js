module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['prettier', 'react', 'import'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'react/display-name': 'off',
  },
};
