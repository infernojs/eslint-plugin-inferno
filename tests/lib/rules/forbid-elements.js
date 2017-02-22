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
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('forbid-elements', rule, {
  valid: [
    {
      code: '<button />',
      options: [],
      parserOptions: parserOptions
    },
    {
      code: '<button />',
      options: [{forbid: []}],
      parserOptions: parserOptions
    },
    {
      code: '<Button />',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    },
    {
      code: '<Button />',
      options: [{forbid: [{element: 'button'}]}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement(button)',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    },
    {
      code: 'createElement("button")',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    },
    {
      code: 'NotInferno.createElement("button")',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement("_thing")',
      options: [{forbid: ['_thing']}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement("Modal")',
      options: [{forbid: ['Modal']}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement("dotted.component")',
      options: [{forbid: ['dotted.component']}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement(function() {})',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement({})',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    },
    {
      code: 'Inferno.createElement(1)',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: '<button />',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions,
      errors: [{message: '<button> is forbidden'}]
    },
    {
      code: '[<Modal />, <button />]',
      options: [{forbid: ['button', 'Modal']}],
      parserOptions: parserOptions,
      errors: [
        {message: '<Modal> is forbidden'},
        {message: '<button> is forbidden'}
      ]
    },
    {
      code: '<dotted.component />',
      options: [{forbid: ['dotted.component']}],
      parserOptions: parserOptions,
      errors: [
        {message: '<dotted.component> is forbidden'}
      ]
    },
    {
      code: '<dotted.Component />',
      options: [{forbid: [
        {element: 'dotted.Component', message: 'that ain\'t cool'}
      ]}],
      parserOptions: parserOptions,
      errors: [{message: '<dotted.Component> is forbidden, that ain\'t cool'}]
    },
    {
      code: '<button />',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'}
      ]}],
      parserOptions: parserOptions,
      errors: [{message: '<button> is forbidden, use <Button> instead'}]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: [{element: 'button'}, {element: 'input'}]}],
      parserOptions: parserOptions,
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: [{element: 'button'}, 'input']}],
      parserOptions: parserOptions,
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: ['input', {element: 'button'}]}],
      parserOptions: parserOptions,
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
      parserOptions: parserOptions,
      errors: [{message: '<button> is forbidden, use <Button2> instead'}]
    },
    {
      code: 'Inferno.createElement("button", {}, child)',
      options: [{forbid: ['button']}],
      parserOptions: parserOptions,
      errors: [{message: '<button> is forbidden'}]
    },
    {
      code: '[Inferno.createElement(Modal), Inferno.createElement("button")]',
      options: [{forbid: ['button', 'Modal']}],
      parserOptions: parserOptions,
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
      parserOptions: parserOptions,
      errors: [{message: '<dotted.Component> is forbidden, that ain\'t cool'}]
    },
    {
      code: 'Inferno.createElement(dotted.component)',
      options: [{forbid: ['dotted.component']}],
      parserOptions: parserOptions,
      errors: [
        {message: '<dotted.component> is forbidden'}
      ]
    },
    {
      code: 'Inferno.createElement(_comp)',
      options: [{forbid: ['_comp']}],
      parserOptions: parserOptions,
      errors: [
        {message: '<_comp> is forbidden'}
      ]
    },
    {
      code: 'Inferno.createElement("button")',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'}
      ]}],
      parserOptions: parserOptions,
      errors: [{message: '<button> is forbidden, use <Button> instead'}]
    },
    {
      code: 'Inferno.createElement("button", {}, Inferno.createElement("input"))',
      options: [{forbid: [{element: 'button'}, {element: 'input'}]}],
      parserOptions: parserOptions,
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    }
  ]
});
