/**
 * @fileoverview Tests for jsx-uses-inferno
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint');
var rule = require('eslint/lib/rules/no-unused-vars');
var RuleTester = eslint.RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var settings = {
  inferno: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
var linter = ruleTester.linter || eslint.linter;
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
