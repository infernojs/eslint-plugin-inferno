'use strict';

const configAll = require('./configs/all');
const configRecommended = require('./configs/recommended');
const configRuntime = require('./configs/jsx-runtime');

const allRules = require('./lib/rules');

// for legacy config system
const plugins = [
  'inferno',
];

module.exports = {
  deprecatedRules: configAll.plugins.inferno.deprecatedRules,
  rules: allRules,
  configs: {
    recommended: {
      ...configRecommended,
      parserOptions: configRecommended.languageOptions.parserOptions,
      plugins,
    },
    all: {
      ...configAll,
      parserOptions: configAll.languageOptions.parserOptions,
      plugins,
    },
    'jsx-runtime': {
      ...configRuntime,
      parserOptions: configRuntime.languageOptions.parserOptions,
      plugins,
    },
  },
};
