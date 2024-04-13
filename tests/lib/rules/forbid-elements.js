/**
 * @fileoverview Tests for forbid-elements
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-elements');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('forbid-elements', rule, {
  valid: parsers.all([
    {
      code: '<button />',
      options: [],
    },
    {
      code: '<button />',
      options: [{ forbid: [] }],
    },
    {
      code: '<Button />',
      options: [{ forbid: ['button'] }],
    },
    {
      code: '<Button />',
      options: [{ forbid: [{ element: 'button' }] }],
    },
    {
      code: 'Inferno.createElement(button)',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'createElement("button")',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'NotInferno.createElement("button")',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'Inferno.createElement("_thing")',
      options: [{ forbid: ['_thing'] }],
    },
    {
      code: 'Inferno.createElement("Modal")',
      options: [{ forbid: ['Modal'] }],
    },
    {
      code: 'Inferno.createElement("dotted.component")',
      options: [{ forbid: ['dotted.component'] }],
    },
    {
      code: 'Inferno.createElement(function() {})',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'Inferno.createElement({})',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'Inferno.createElement(1)',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'Inferno.createElement()',
    },
  ]),

  invalid: parsers.all([
    {
      code: '<button />',
      options: [{ forbid: ['button'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: '[<Modal />, <button />]',
      options: [{ forbid: ['button', 'Modal'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'Modal' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: '<dotted.component />',
      options: [{ forbid: ['dotted.component'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'dotted.component' },
        },
      ],
    },
    {
      code: '<dotted.Component />',
      options: [
        {
          forbid: [
            { element: 'dotted.Component', message: 'that ain\'t cool' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'dotted.Component', message: 'that ain\'t cool' },
        },
      ],
    },
    {
      code: '<button />',
      options: [
        {
          forbid: [
            { element: 'button', message: 'use <Button> instead' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'button', message: 'use <Button> instead' },
        },
      ],
    },
    {
      code: '<button><input /></button>',
      options: [
        {
          forbid: [
            { element: 'button' },
            { element: 'input' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
    {
      code: '<button><input /></button>',
      options: [{ forbid: [{ element: 'button' }, 'input'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
    {
      code: '<button><input /></button>',
      options: [{ forbid: ['input', { element: 'button' }] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
    {
      code: '<button />',
      options: [
        {
          forbid: [
            { element: 'button', message: 'use <Button> instead' },
            { element: 'button', message: 'use <Button2> instead' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'button', message: 'use <Button2> instead' },
        },
      ],
    },
    {
      code: 'Inferno.createElement("button", {}, child)',
      options: [{ forbid: ['button'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: '[Inferno.createElement(Modal), Inferno.createElement("button")]',
      options: [{ forbid: ['button', 'Modal'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'Modal' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: 'Inferno.createElement(dotted.Component)',
      options: [
        {
          forbid: [
            { element: 'dotted.Component', message: 'that ain\'t cool' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'dotted.Component', message: 'that ain\'t cool' },
        },
      ],
    },
    {
      code: 'Inferno.createElement(dotted.component)',
      options: [{ forbid: ['dotted.component'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'dotted.component' },
        },
      ],
    },
    {
      code: 'Inferno.createElement(_comp)',
      options: [{ forbid: ['_comp'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: '_comp' },
        },
      ],
    },
    {
      code: 'Inferno.createElement("button")',
      options: [
        {
          forbid: [
            { element: 'button', message: 'use <Button> instead' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'button', message: 'use <Button> instead' },
        },
      ],
    },
    {
      code: 'Inferno.createElement("button", {}, Inferno.createElement("input"))',
      options: [
        {
          forbid: [
            { element: 'button' }, { element: 'input' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
  ]),
});
