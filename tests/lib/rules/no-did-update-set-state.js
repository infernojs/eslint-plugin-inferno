/**
 * @fileoverview Prevent usage of setState in componentDidUpdate
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-did-update-set-state');

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

const invalid = [
  {
    code: `
      var Hello = createClass({
        componentDidUpdate: function() {
          this.setState({
            data: data
          });
        }
      });
    `,
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidUpdate() {
          this.setState({
            data: data
          });
        }
      }
    `,
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidUpdate = () => {
          this.setState({
            data: data
          });
        }
      }
    `,
    features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
    var Hello = createClass({
      componentDidUpdate: function() {
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
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidUpdate() {
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
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidUpdate: function() {
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
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidUpdate() {
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
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidUpdate: function() {
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
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidUpdate() {
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
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidUpdate: function() {
          someClass.onSomeEvent((data) => this.setState({data: data}));
        }
      });
    `,
    options: ['disallow-in-func'],
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidUpdate() {
          someClass.onSomeEvent((data) => this.setState({data: data}));
        }
      }
    `,
    options: ['disallow-in-func'],
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidUpdate' },
      },
    ],
  },
];

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-did-update-set-state', rule, {
  valid: parsers.all([].concat(
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
          componentDidUpdate: function() {}
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: function() {
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
          componentDidUpdate: function() {
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
    // invalid.map((test) => {
    //   const newTest = Object.assign({}, test, {
    //     settings: Object.assign({}, test.settings, {}),
    //   });
    //   delete newTest.errors;
    //   return newTest;
    // })
  )),

  invalid: parsers.all(invalid),
});
