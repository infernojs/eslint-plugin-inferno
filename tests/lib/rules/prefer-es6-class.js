/**
 * @fileoverview Prefer es6 class instead of createClass for Inferno Component
 * @author Dan Hamilton
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/prefer-es6-class');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('prefer-es6-class', rule, {
  valid: parsers.all([
    {
      code: `
        class Hello extends Inferno.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `,
    },
    {
      code: `
        export default class Hello extends Inferno.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `,
    },
    {
      code: `
        var Hello = "foo";
        module.exports = {};
      `,
    },
    {
      code: `
        var Hello = createClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      options: ['never'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      options: ['always'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createClass({
          displayName: 'Hello',
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'shouldUseES6Class' }],
    },
    {
      code: `
        var Hello = createClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      options: ['always'],
      errors: [{ messageId: 'shouldUseES6Class' }],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      options: ['never'],
      errors: [{ messageId: 'shouldUseCreateClass' }],
    },
  ]),
});
