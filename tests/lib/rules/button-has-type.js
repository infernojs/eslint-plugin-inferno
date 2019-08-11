/**
 * @fileoverview Forbid "button" element without an explicit "type" attribute
 * @author Filipp Riabchun
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/button-has-type');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('button-has-type', rule, {
  valid: [
    {code: '<span/>'},
    {code: '<span type="foo"/>'},
    {code: '<button type="button"/>'},
    {code: '<button type="submit"/>'},
    {code: '<button type="reset"/>'},
    {
      code: '<button type="button"/>',
      options: [{reset: false}]
    },
    {code: 'Inferno.createElement("span")'},
    {code: 'Inferno.createElement("span", {type: "foo"})'},
    {code: 'Inferno.createElement("button", {type: "button"})'},
    {code: 'Inferno.createElement("button", {type: "submit"})'},
    {code: 'Inferno.createElement("button", {type: "reset"})'},
    {
      code: 'Inferno.createElement("button", {type: "button"})',
      options: [{reset: false}]
    },
    {
      code: 'document.createElement("button")'
    },
    {
      code: 'Foo.createElement("span")',
      settings: {
        inferno: {
          pragma: 'Foo'
        }
      }
    }
  ],
  invalid: [
    {
      code: '<button/>',
      errors: [{
        message: 'Missing an explicit type attribute for button'
      }]
    },
    {
      code: '<button type="foo"/>',
      errors: [{
        message: '"foo" is an invalid value for button type attribute'
      }]
    },
    {
      code: '<button type={foo}/>',
      errors: [{
        message: '`foo` is an invalid value for button type attribute'
      }]
    },
    {
      code: '<button type="reset"/>',
      options: [{reset: false}],
      errors: [{
        message: '"reset" is a forbidden value for button type attribute'
      }]
    },
    {
      code: 'Inferno.createElement("button")',
      errors: [{
        message: 'Missing an explicit type attribute for button'
      }]
    },
    {
      code: 'Inferno.createElement("button", {type: "foo"})',
      errors: [{
        message: '"foo" is an invalid value for button type attribute'
      }]
    },
    {
      code: 'Inferno.createElement("button", {type: "reset"})',
      options: [{reset: false}],
      errors: [{
        message: '"reset" is a forbidden value for button type attribute'
      }]
    },
    {
      code: 'Foo.createElement("button")',
      errors: [{
        message: 'Missing an explicit type attribute for button'
      }],
      settings: {
        inferno: {
          pragma: 'Foo'
        }
      }
    }
  ]
});
