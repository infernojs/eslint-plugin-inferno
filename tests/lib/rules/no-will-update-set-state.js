/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-will-update-set-state');

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
ruleTester.run('no-will-update-set-state', rule, {
  valid: parsers.all([
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
          componentWillUpdate: function() {}
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            function handleEvent(data) {
              this.setState({
                data: data
              });
            }
            someClass.onSomeEvent(handleEvent)
          }
        });
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            this.setState({
              data: data
            });
          }
        });
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            this.setState({
              data: data
            });
          }
        });
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          componentWillUpdate() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        }
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            if (true) {
              this.setState({
                data: data
              });
            }
          }
        });
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          componentWillUpdate() {
            if (true) {
              this.setState({
                data: data
              });
            }
          }
        }
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent((data) => this.setState({data: data}));
          }
        });
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          componentWillUpdate() {
            someClass.onSomeEvent((data) => this.setState({data: data}));
          }
        }
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
  ]),
});
