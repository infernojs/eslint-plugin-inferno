/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-multi-comp');
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
ruleTester.run('no-multi-comp', rule, {

  valid: [{
    code: [
      'var Hello = require(\'./components/Hello\');',
      'var HelloJohn = Inferno.createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\r')
  }, {
    code: [
      'var Heading = Inferno.createClass({',
      '  render: function() {',
      '    return (',
      '      <div>',
      '        {this.props.buttons.map(function(button, index) {',
      '          return <Button {...button} key={index}/>;',
      '        })}',
      '      </div>',
      '    );',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    options: [{
      ignoreStateless: true
    }]
  }, {
    // multiple non-components
    code: [
      'import Inferno, { createElement } from "inferno"',
      'const helperFoo = () => {',
      '  return true;',
      '};',
      'function helperBar() {',
      '  return false;',
      '};',
      'function RealComponent() {',
      '  return createElement("img");',
      '};'
    ].join('\n'),
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
  }],

  invalid: [{
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});',
      'var HelloJohn = Inferno.createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    errors: [{
      message: 'Declare only one Inferno component per file',
      line: 6
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'class HelloJohn extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}',
      'class HelloJohnny extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="Johnny" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      message: 'Declare only one Inferno component per file',
      line: 6
    }, {
      message: 'Declare only one Inferno component per file',
      line: 11
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Declare only one Inferno component per file',
      line: 4
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      message: 'Declare only one Inferno component per file',
      line: 4
    }]
  }, {
    code: [
      'export default {',
      '  renderHello(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  },',
      '  renderHello2(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Declare only one Inferno component per file',
      line: 6
    }]
  }]
});
