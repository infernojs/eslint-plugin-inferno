/**
 * @fileoverview Tests for no-adjacent-inline-elements
 * @author Sean Hayes
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-adjacent-inline-elements');

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-adjacent-inline-elements', rule, {
  valid: [
    {
      code: '<div />;',
      parserOptions
    },
    {
      code: '<div><div></div><div></div></div>;',
      parserOptions
    },
    {
      code: '<div><p></p><div></div></div>;',
      parserOptions
    },
    {
      code: '<div><p></p><a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a>&nbsp;<a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a>&nbsp;some text &nbsp; <a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a>&nbsp;some text <a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a> <a></a></div>;',
      parserOptions
    },
    {
      code: '<div><ul><li><a></a></li><li><a></a></li></ul></div>;',
      parserOptions
    },
    {
      code: '<div><a></a> some text <a></a></div>;',
      parserOptions
    },
    {
      code: 'Inferno.createElement("div", null, "some text");',
      parserOptions
    },
    {
      code: ('Inferno.createElement("div", undefined, [Inferno.createElement("a"), '
        + '" some text ", Inferno.createElement("a")]);'),
      parserOptions
    },
    {
      code: 'Inferno.createElement("div", undefined, [Inferno.createElement("a"), " ", Inferno.createElement("a")]);',
      parserOptions
    },
    {
      code: 'Inferno.createElement(a, b);',
      parserOptions
    }
  ],
  invalid: [
    {
      code: '<div><a></a><a></a></div>;',
      errors: [{messageId: 'inlineElement'}],
      parserOptions
    },
    {
      code: '<div><a></a><span></span></div>;',
      errors: [{messageId: 'inlineElement'}],
      parserOptions
    },
    {
      code: 'Inferno.createElement("div", undefined, [Inferno.createElement("a"), Inferno.createElement("span")]);',
      errors: [{messageId: 'inlineElement'}],
      parserOptions
    }
  ]
});
