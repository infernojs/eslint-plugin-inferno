'use strict';

const all = require('./all');

module.exports = Object.assign({}, all, {
  languageOptions: all.languageOptions,
  rules: {
    'inferno/jsx-key': 2,
    'inferno/jsx-no-comment-textnodes': 2,
    'inferno/jsx-no-duplicate-props': 2,
    'inferno/jsx-no-target-blank': 2,
    'inferno/jsx-no-undef': 2,
    'inferno/jsx-uses-vars': 2,
    'inferno/no-children-prop': 2,
    'inferno/no-danger-with-children': 2,
    'inferno/no-direct-mutation-state': 2,
    'inferno/no-find-dom-node': 2,
    'inferno/no-is-mounted': 2,
    'inferno/no-render-return-value': 2,
    'inferno/no-string-refs': 2,
    'inferno/no-unescaped-entities': 2,
    'inferno/no-unknown-property': 2,
    'inferno/require-render-return': 2,
  },
});

// this is so the `languageOptions` property won't be warned in the new config system
Object.defineProperty(module.exports, 'languageOptions', { enumerable: false });
