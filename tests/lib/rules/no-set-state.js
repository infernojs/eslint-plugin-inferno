/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-set-state');

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
ruleTester.run('no-set-state', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = function() {
          this.setState({})
        };
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
    },
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          },
          render: function() {
            return <div>Hello {this.props.name}</div>;
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
            this.setState({
              name: this.props.name.toUpperCase()
            });
          },
          render: function() {
            return <div>Hello {this.state.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'noSetState' }],
    },
    {
      code: `
        var Hello = createClass({
          someMethod: function() {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          },
          render: function() {
            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'noSetState' }],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          someMethod() {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
          }
        };
      `,
      errors: [{ messageId: 'noSetState' }],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          someMethod = () => {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
          }
        };
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove `no-ts-old` and fix
      errors: [{ messageId: 'noSetState' }],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render() {
            return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;
          }
        };
      `,
      errors: [{ messageId: 'noSetState' }],
    },
  ]),
});
