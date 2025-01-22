'use strict';

const inferno = require('../../../..');
const infernoRecommended = require('../../../../configs/recommended');

module.exports = [
  {
    files: ['**/*.jsx'],
    plugins: { inferno }
  },
  {
    files: ['**/*.jsx'],
    ...infernoRecommended,
    languageOptions: {
      ...infernoRecommended.languageOptions
    }
  }
];
