/**
 * @fileoverview Prefer es6 class instead of createClass for Inferno Component
 * @author Dan Hamilton
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-es6-class');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prefer-es6-class', rule, {

  valid: [{
    code: `
      class Hello extends Inferno.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
      Hello.displayName = 'Hello'
    `
  }, {
    code: `
      export default class Hello extends Inferno.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
      Hello.displayName = 'Hello'
    `
  }, {
    code: `
      var Hello = "foo";
      module.exports = {};
    `
  }, {
    code: `
      var Hello = Inferno.createClass({
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    options: ['never']
  }, {
    code: `
      class Hello extends Inferno.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    options: ['always']
  }],

  invalid: [{
    code: `
      var Hello = Inferno.createClass({
        displayName: 'Hello',
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    errors: [{
      message: 'Component should use es6 class instead of createClass'
    }]
  }, {
    code: `
      var Hello = Inferno.createClass({
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    options: ['always'],
    errors: [{
      message: 'Component should use es6 class instead of createClass'
    }]
  }, {
    code: `
      class Hello extends Inferno.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    options: ['never'],
    errors: [{
      message: 'Component should use createClass instead of es6 class'
    }]
  }]
});
