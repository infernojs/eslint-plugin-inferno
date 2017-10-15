/**
 * @fileoverview Tests for jsx-uses-inferno
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('eslint/lib/rules/no-unused-vars');
const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const settings = {
  inferno: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('jsx-uses-inferno', require('../../../lib/rules/jsx-uses-inferno'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <div />;'},
    {code: '/*eslint jsx-uses-inferno:1*/ var Inferno; (function () { <div /> })();'},
    {code: '/*eslint jsx-uses-inferno:1*/ /** @jsx Foo */ var Foo; <div />;'},
    {code: '/*eslint jsx-uses-inferno:1*/ var Foo; <div />;', settings: settings}
  ],
  invalid: [{
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno;',
    errors: [{message: '\'Inferno\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ /** @jsx Foo */ var Inferno; <div />;',
    errors: [{message: '\'Inferno\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <div />;',
    errors: [{message: '\'Inferno\' is defined but never used.'}], settings: settings
  }]
});
