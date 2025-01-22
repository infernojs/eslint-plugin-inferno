'use strict';

const inferno = require('eslint-plugin-inferno');

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    plugins: {
      inferno,
    },
  },
];

module.exports = config;
