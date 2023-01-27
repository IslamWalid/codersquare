module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    'no-trailing-spaces': ['warn'],
    'comma-dangle': ['warn']
  }
};
