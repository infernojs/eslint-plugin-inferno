/**
 * @fileoverview Tests for jsx-uses-inferno
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var rule = require('eslint/lib/rules/no-unused-vars');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
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

var ruleTester = new RuleTester();
eslint.defineRule('jsx-uses-inferno', require('../../../lib/rules/jsx-uses-inferno'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <div />;', parserOptions: parserOptions},
    {code: '/*eslint jsx-uses-inferno:1*/ var Inferno; (function () { <div /> })();', parserOptions: parserOptions},
    {code: '/*eslint jsx-uses-inferno:1*/ /** @jsx Foo */ var Foo; <div />;', parserOptions: parserOptions},
    {code: '/*eslint jsx-uses-inferno:1*/ var Foo; <div />;', settings: settings, parserOptions: parserOptions}
  ],
  invalid: [{
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno;',
    errors: [{message: '\'Inferno\' is defined but never used.'}], parserOptions: parserOptions
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ /** @jsx Foo */ var Inferno; <div />;',
    errors: [{message: '\'Inferno\' is defined but never used.'}], parserOptions: parserOptions
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <div />;',
    errors: [{message: '\'Inferno\' is defined but never used.'}], settings: settings, parserOptions: parserOptions
  }]
});
