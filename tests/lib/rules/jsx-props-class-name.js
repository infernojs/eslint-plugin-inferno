/**
 * @fileoverview Tests for jsx-props-class-name rule.
 * @author Bernhard Reisenberger
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-props-class-name');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};


const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-props-class-name', rule, {
  valid: [{
    code: '<div className="" />',
    options: ['className']
  },
  {
    code: '<div class="" />',
    options: ['class']
  }
  ],
  invalid: [{
    code: '<div className="" />',
    output: '<div class="" />',
    options: ['class'],
    errors: [{message: 'Invalid attribute \'className\' found, use \'class\' instead'}]
  },
  {
    code: '<div class="" />',
    output: '<div className="" />',
    options: ['className'],
    errors: [{message: 'Invalid attribute \'class\' found, use \'className\' instead'}]
  }
  ]
});
