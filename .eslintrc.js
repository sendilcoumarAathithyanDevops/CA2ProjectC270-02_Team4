module.exports = {
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-param-reassign': 'warn',
    'func-names': 'off',
    'object-shorthand': 'off',
    'no-undef': 'warn',
    'prefer-arrow-callback': 'warn'
  }
};
