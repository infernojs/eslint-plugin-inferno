/**
 * @fileoverview Prevent usage of findDOMNode
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-find-dom-node');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-find-dom-node', rule, {

  valid: [{
    code: [
      'var Hello = function() {};'
    ].join('\n')
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  componentDidMount: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someFunc = Inferno.findDOMNode;',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  componentDidMount: function() {',
      '    Inferno.someFunc(this);',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }],

  invalid: [{
    code: [
      'var Hello = Inferno.createClass({',
      '  componentDidMount: function() {',
      '    Inferno.findDOMNode(this).scrollIntoView();',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  componentDidMount: function() {',
      '    Inferno.findDOMNode(this).scrollIntoView();',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }, {
    code: [
      'class Hello extends Component {',
      '  componentDidMount() {',
      '    findDOMNode(this).scrollIntoView();',
      '  }',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '};'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }]
});
