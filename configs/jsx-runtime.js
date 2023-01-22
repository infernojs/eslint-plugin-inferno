'use strict';

const all = require('./all');

module.exports = Object.assign({}, all, {
  languageOptions: Object.assign({}, all.languageOptions, {
    parserOptions: Object.assign({}, all.languageOptions.parserOptions, {
      jsxPragma: null, // for @typescript/eslint-parser
    }),
  }),
  rules: {
    'inferno/inferno-in-jsx-scope': 0,
    'inferno/jsx-uses-inferno': 0,
  },
});

// this is so the `languageOptions` property won't be warned in the new config system
Object.defineProperty(module.exports, 'languageOptions', { enumerable: false });
