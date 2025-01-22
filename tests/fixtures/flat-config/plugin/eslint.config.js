'use strict';

const inferno = require('../../../..');

module.exports = [{
  files: ['**/*.jsx'],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    inferno,
  },
  rules: {
    'inferno/jsx-no-literals': 1,
  },
}];
