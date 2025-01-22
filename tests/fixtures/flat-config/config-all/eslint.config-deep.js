'use strict';

const infernoAll = require('../../../../configs/all');

module.exports = [{
  files: ['**/*.jsx'],
  ...infernoAll,
  languageOptions: {
    ...infernoAll.languageOptions
  }
}];
