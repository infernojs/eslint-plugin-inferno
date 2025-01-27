/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-did-mount-set-state');

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
        componentDidMount: function() {
          this.setState({
            data: data
          });
        }
      });
    `,
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidMount() {
          this.setState({
            data: data
          });
        }
      }
    `,
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidMount = () => {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidMount: function() {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidMount() {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidMount: function() {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidMount() {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidMount: function() {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidMount() {
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
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      var Hello = createClass({
        componentDidMount: function() {
          someClass.onSomeEvent((data) => this.setState({data: data}));
        }
      });
    `,
    options: ['disallow-in-func'],
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidMount' },
      },
    ],
  },
  {
    code: `
      class Hello extends Inferno.Component {
        componentDidMount() {
          someClass.onSomeEvent((data) => this.setState({data: data}));
        }
      }
    `,
    options: ['disallow-in-func'],
    errors: [
      {
        messageId: 'noSetState',
        data: { name: 'componentDidMount' },
      },
    ],
  },
];

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-did-mount-set-state', rule, {
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
          componentDidMount: function() {}
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidMount: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidMount: function() {
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
          componentDidMount: function() {
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
