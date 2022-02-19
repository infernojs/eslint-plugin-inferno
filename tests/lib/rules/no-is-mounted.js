/**
 * @fileoverview Prevent usage of isMounted
 * @author Joe Lencioni
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-is-mounted');

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
ruleTester.run('no-is-mounted', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = function() {
        };
      `,
    },
    {
      code: `
        var Hello = createClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someFunc = this.isMounted;
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: function() {
            if (!this.isMounted()) {
              return;
            }
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
      errors: [{ messageId: 'noIsMounted' }],
    },
    {
      code: `
        var Hello = createClass({
          someMethod: function() {
            if (!this.isMounted()) {
              return;
            }
          },
          render: function() {
            return <div onClick={this.someMethod.bind(this)}>Hello</div>;
          }
        });
      `,
      errors: [{ messageId: 'noIsMounted' }],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          someMethod() {
            if (!this.isMounted()) {
              return;
            }
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello</div>;
          }
        };
      `,
      errors: [{ messageId: 'noIsMounted' }],
    },
  ]),
});
