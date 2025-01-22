'use strict';

const infernoPlugin = require('../../../..');

module.exports = [{
  files: ['**/*.jsx'],
  ...infernoPlugin.configs.flat.recommended
}];
