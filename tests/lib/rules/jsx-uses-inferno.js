/**
 * @fileoverview Tests for jsx-uses-inferno
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('../../helpers/getESLintCoreRule')('no-unused-vars');

const RuleTester = eslint.RuleTester;

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  inferno: {
    pragma: 'Foo',
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('jsx-uses-inferno', require('../../../lib/rules/jsx-uses-inferno'));

ruleTester.run('no-unused-vars', rule, {
  valid: [
    { code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <div />;' },
    { code: '/*eslint jsx-uses-inferno:1*/ var Inferno; (function () { <div /> })();' },
    { code: '/*eslint jsx-uses-inferno:1*/ /** @jsx Foo */ var Foo; <div />;' },
    { code: '/*eslint jsx-uses-inferno:1*/ var Foo; <div />;', settings },
    { code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <></>;', parser: parsers.BABEL_ESLINT },
  ],
  invalid: [{
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno;',
    errors: [{ message: '\'Inferno\' is defined but never used.' }],
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ /** @jsx Foo */ var Inferno; <div />;',
    errors: [{ message: '\'Inferno\' is defined but never used.' }],
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <div />;',
    errors: [{ message: '\'Inferno\' is defined but never used.' }],
    settings,
  }, {
    code: '/*eslint jsx-uses-inferno:1*/ var Inferno; <></>;',
    parser: parsers.BABEL_ESLINT,
    errors: [{ message: '\'Inferno\' is defined but never used.' }],
    settings,
  }],
});
