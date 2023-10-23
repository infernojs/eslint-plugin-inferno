'use strict';

const all = require('./all');

module.exports = {
  ...all,
  languageOptions: {
    ...all.languageOptions,
    parserOptions: { ...all.languageOptions.parserOptions, jsxPragma: null },
  },
  rules: {
    'inferno/inferno-in-jsx-scope': 0,
    'inferno/jsx-uses-inferno': 0,
  },
};

// this is so the `languageOptions` property won't be warned in the new config system
Object.defineProperty(module.exports, 'languageOptions', { enumerable: false });
