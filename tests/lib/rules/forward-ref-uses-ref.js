/**
 * @fileoverview Require all forwardRef components include a ref parameter
 * @author Tiger Oakes
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/forward-ref-uses-ref');
const parsers = require('../../helpers/parsers');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('forward-ref-uses-ref', rule, {
  valid: parsers.all([
    {
      code: `
        import { forwardRef } from 'inferno'
        forwardRef((props, ref) => {
          return null;
        });
      `,
    },
    {
      code: `
        import { forwardRef } from 'inferno'
        forwardRef((props, ref) => null);
      `,
    },
    {
      code: `
        import { forwardRef } from 'inferno'
        forwardRef(function (props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import { forwardRef } from 'inferno'
        forwardRef(function Component(props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef((props, ref) => {
          return null;
        });
      `,
    },
    {
      code: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef((props, ref) => null);
      `,
    },
    {
      code: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef(function (props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef(function Component(props, ref) {
          return null;
        });
      `,
    },
    {
      code: `
        import * as Inferno from 'inferno'
        function Component(props) {
          return null;
        };
      `,
    },
    {
      code: `
        import * as Inferno from 'inferno'
        (props) => null;
      `,
    },
  ]),
  invalid: parsers.all([
    {
      code: `
        import { forwardRef } from 'inferno'
        forwardRef((props) => {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import { forwardRef } from 'inferno'
        forwardRef((props, ref) => {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import { forwardRef } from 'inferno'
        (props) => {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import { forwardRef } from 'inferno'
        forwardRef(props => {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import { forwardRef } from 'inferno'
        forwardRef((props, ref) => {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import { forwardRef } from 'inferno'
        props => {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef((props) => null);
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef((props, ref) => null);
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import * as Inferno from 'inferno'
        (props) => null;
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import { forwardRef } from 'inferno'
        const Component = forwardRef(function (props) {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import { forwardRef } from 'inferno'
        const Component = forwardRef(function (props, ref) {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import { forwardRef } from 'inferno'
        const Component = function (props) {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef(function Component(props) {
          return null;
        });
      `,
      errors: [
        {
          message: 'forwardRef is used with this component but no ref parameter is set',
          suggestions: [
            {
              messageId: 'addRefParameter',
              output: `
        import * as Inferno from 'inferno'
        Inferno.forwardRef(function Component(props, ref) {
          return null;
        });
      `,
            },
            {
              messageId: 'removeForwardRef',
              output: `
        import * as Inferno from 'inferno'
        function Component(props) {
          return null;
        };
      `,
            },
          ],
        },
      ],
    },
  ]),
});
