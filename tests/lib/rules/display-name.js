/**
 * @fileoverview Prevent missing displayName in a Inferno component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/display-name');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var settings = {
  inferno: {
    pragma: 'Foo'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('display-name', rule, {

  valid: [{
    code: [
      'var Hello = Inferno.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello {',
      '  render() {',
      '    return \'Hello World\';',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Greetings {',
      '  static text = \'Hello World\';',
      '  render() {',
      '    return Hello.text;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'class Hello {',
      '  method;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  static get displayName() {',
      '    return \'Hello\';',
      '  }',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  static displayName = \'Widget\';',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'export default class Hello {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello;',
      'Hello = Inferno.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'module.exports = Inferno.createClass({',
      '  "displayName": "Hello",',
      '  "render": function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'export default class {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = function() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'function Hello() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = () => {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'module.exports = function Hello() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'function Hello() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}',
      'Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = () => {',
      '  return <div>Hello {this.props.name}</div>;',
      '}',
      'Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = function() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}',
      'Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Mixins = {',
      '  Greetings: {',
      '    Hello: function() {',
      '      return <div>Hello {this.props.name}</div>;',
      '    }',
      '  }',
      '}',
      'Mixins.Greetings.Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  },',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  },',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'const Mixin = {',
      '  Button() {',
      '    return (',
      '      <button />',
      '    );',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var obj = {',
      '  pouf: function() {',
      '    return any',
      '  }',
      '};'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var obj = {',
      '  pouf: function() {',
      '    return any',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'export default {',
      '  renderHello() {',
      '    let {name} = this.props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'import Inferno, { createClass } from \'inferno\';',
      'export default createClass({',
      '  displayName: \'Foo\',',
      '  render() {',
      '    return <h1>foo</h1>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'import Inferno, {Component} from "inferno";',
      'function someDecorator(ComposedComponent) {',
      '  return class MyDecorator extends Component {',
      '    render() {return <ComposedComponent {...this.props} />;}',
      '  };',
      '}',
      'module.exports = someDecorator;'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const element = (',
      '  <Media query={query} render={() => {',
      '    renderWasCalled = true',
      '    return <div/>',
      '  }}/>',
      ')'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const element = (',
      '  <Media query={query} render={function() {',
      '    renderWasCalled = true',
      '    return <div/>',
      '  }}/>',
      ')'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'module.exports = {',
      '  createElement: tagName => document.createElement(tagName)',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const { createElement } = document;',
      'createElement("a");'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    return Inferno.createVNode("div", {}, "text content");',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'function HelloComponent() {',
      '  return Inferno.createClass({',
      '    render: function() {',
      '      return <div>Hello {this.props.name}</div>;',
      '    }',
      '  });',
      '}',
      'module.exports = HelloComponent();'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'module.exports = () => {',
      '  return <div>Hello {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'module.exports = function() {',
      '  return <div>Hello {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'module.exports = Inferno.createClass({',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  },',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'var Hello = Foo.createClass({',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  },',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    settings: settings,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      '/** @jsx Foo */',
      'var Hello = Foo.createClass({',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  },',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'const Mixin = {',
      '  Button() {',
      '    return (',
      '      <button />',
      '    );',
      '  }',
      '};'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'import Inferno, { createElement } from "inferno";',
      'export default (props) => {',
      '  return createElement("div", {}, "hello");',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'import Inferno from "inferno";',
      'const { createElement } = Inferno;',
      'export default (props) => {',
      '  return createElement("div", {}, "hello");',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'import Inferno from "inferno";',
      'const createElement = Inferno.createElement;',
      'export default (props) => {',
      '  return createElement("div", {}, "hello");',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }]
});
