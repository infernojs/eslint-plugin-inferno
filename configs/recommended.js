'use strict';

const plugin = require('..');

const legacyConfig = plugin.configs.recommended;

module.exports = {
  plugins: { inferno: plugin },
  rules: legacyConfig.rules,
  languageOptions: { parserOptions: legacyConfig.parserOptions },
};

Object.defineProperty(module.exports, 'languageOptions', { enumerable: false });
