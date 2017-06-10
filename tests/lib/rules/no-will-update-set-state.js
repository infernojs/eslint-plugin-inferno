/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-will-update-set-state');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-will-update-set-state', rule, {

  valid: [{
    code: [
      'var Hello = inferno.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {}',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someHandler = this.setState;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    function handleEvent(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '    someClass.onSomeEvent(handleEvent)',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  componentWillUpdate() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  componentWillUpdate() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '});'
    ].join('\n'),
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  componentWillUpdate() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    if (true) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  componentWillUpdate() {',
      '    if (true) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = inferno.createClass({',
      '  componentWillUpdate: function() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  componentWillUpdate() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }]
});
