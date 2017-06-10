/**
 * @fileoverview Tests for forbid-elements
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/forbid-elements');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-elements', rule, {
  valid: [
    {
      code: '<button />',
      options: []
    },
    {
      code: '<button />',
      options: [{forbid: []}]
    },
    {
      code: '<Button />',
      options: [{forbid: ['button']}]
    },
    {
      code: '<Button />',
      options: [{forbid: [{element: 'button'}]}]
    },
    {
      code: 'Inferno.createElement(button)',
      options: [{forbid: ['button']}]
    },
    {
      code: 'createElement("button")',
      options: [{forbid: ['button']}]
    },
    {
      code: 'NotInferno.createElement("button")',
      options: [{forbid: ['button']}]
    },
    {
      code: 'Inferno.createElement("_thing")',
      options: [{forbid: ['_thing']}]
    },
    {
      code: 'Inferno.createElement("Modal")',
      options: [{forbid: ['Modal']}]
    },
    {
      code: 'Inferno.createElement("dotted.component")',
      options: [{forbid: ['dotted.component']}]
    },
    {
      code: 'Inferno.createElement(function() {})',
      options: [{forbid: ['button']}]
    },
    {
      code: 'Inferno.createElement({})',
      options: [{forbid: ['button']}]
    },
    {
      code: 'Inferno.createElement(1)',
      options: [{forbid: ['button']}]
    }
  ],

  invalid: [
    {
      code: '<button />',
      options: [{forbid: ['button']}],
      errors: [{message: '<button> is forbidden'}]
    },
    {
      code: '[<Modal />, <button />]',
      options: [{forbid: ['button', 'Modal']}],
      errors: [
        {message: '<Modal> is forbidden'},
        {message: '<button> is forbidden'}
      ]
    },
    {
      code: '<dotted.component />',
      options: [{forbid: ['dotted.component']}],
      errors: [
        {message: '<dotted.component> is forbidden'}
      ]
    },
    {
      code: '<dotted.Component />',
      options: [{forbid: [
        {element: 'dotted.Component', message: 'that ain\'t cool'}
      ]}],
      errors: [{message: '<dotted.Component> is forbidden, that ain\'t cool'}]
    },
    {
      code: '<button />',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'}
      ]}],
      errors: [{message: '<button> is forbidden, use <Button> instead'}]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: [{element: 'button'}, {element: 'input'}]}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: [{element: 'button'}, 'input']}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: ['input', {element: 'button'}]}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button />',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'},
        {element: 'button', message: 'use <Button2> instead'}
      ]}],
      errors: [{message: '<button> is forbidden, use <Button2> instead'}]
    },
    {
      code: 'Inferno.createElement("button", {}, child)',
      options: [{forbid: ['button']}],
      errors: [{message: '<button> is forbidden'}]
    },
    {
      code: '[Inferno.createElement(Modal), Inferno.createElement("button")]',
      options: [{forbid: ['button', 'Modal']}],
      errors: [
        {message: '<Modal> is forbidden'},
        {message: '<button> is forbidden'}
      ]
    },
    {
      code: 'Inferno.createElement(dotted.Component)',
      options: [{forbid: [
        {element: 'dotted.Component', message: 'that ain\'t cool'}
      ]}],
      errors: [{message: '<dotted.Component> is forbidden, that ain\'t cool'}]
    },
    {
      code: 'Inferno.createElement(dotted.component)',
      options: [{forbid: ['dotted.component']}],
      errors: [
        {message: '<dotted.component> is forbidden'}
      ]
    },
    {
      code: 'Inferno.createElement(_comp)',
      options: [{forbid: ['_comp']}],
      errors: [
        {message: '<_comp> is forbidden'}
      ]
    },
    {
      code: 'Inferno.createElement("button")',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'}
      ]}],
      errors: [{message: '<button> is forbidden, use <Button> instead'}]
    },
    {
      code: 'Inferno.createElement("button", {}, Inferno.createElement("input"))',
      options: [{forbid: [{element: 'button'}, {element: 'input'}]}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    }
  ]
});
