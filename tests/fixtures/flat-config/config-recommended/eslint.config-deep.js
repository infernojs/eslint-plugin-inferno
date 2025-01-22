'use strict';

const infernoRecommended = require('../../../../configs/recommended');

module.exports = [{
  files: ['**/*.jsx'],
  ...infernoRecommended,
  languageOptions: {
    ...infernoRecommended.languageOptions
  }
}];
