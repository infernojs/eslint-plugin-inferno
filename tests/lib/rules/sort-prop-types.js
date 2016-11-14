/**
 * @fileoverview Tests for sort-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/sort-prop-types');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Prop types declarations should be sorted alphabetically';

var ruleTester = new RuleTester();
ruleTester.run('sort-prop-types', rule, {

  valid: [{
    code: [
      'var First = Inferno.createClass({',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    A: Inferno.PropTypes.any,',
      '    Z: Inferno.PropTypes.string,',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    A: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    Z: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = Inferno.createClass({',
      '  propTypes: {',
      '    AA: Inferno.PropTypes.any,',
      '    ZZ: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: Inferno.PropTypes.string,',
      '  z: Inferno.PropTypes.string',
      '};',
      'First.propTypes.justforcheck = Inferno.PropTypes.string;'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: Inferno.PropTypes.any,',
      '  A: Inferno.PropTypes.any,',
      '  z: Inferno.PropTypes.string,',
      '  Z: Inferno.PropTypes.string',
      '};'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Component extends Inferno.Component {',
      '  static propTypes = {',
      '    a: Inferno.PropTypes.any,',
      '    b: Inferno.PropTypes.any,',
      '    c: Inferno.PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "aria-controls": Inferno.PropTypes.string',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreCase: true
    }]
  }, {
    // Invalid code, should not be validated
    code: [
      'class Component extends Inferno.Component {',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    c: Inferno.PropTypes.any,',
      '    b: Inferno.PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = Inferno.createClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    barRequired: Inferno.PropTypes.func.isRequired,',
      '    onBar: Inferno.PropTypes.func,',
      '    z: Inferno.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onBar: Inferno.PropTypes.func,',
      '    onFoo: Inferno.PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Component extends Inferno.Component {',
      '  static propTypes = {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onBar: Inferno.PropTypes.func,',
      '    onFoo: Inferno.PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onBar: Inferno.PropTypes.func,',
      '    onFoo: Inferno.PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    barRequired: Inferno.PropTypes.string.isRequired,',
      '    a: Inferno.PropTypes.any',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    fooRequired: MyPropType,',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    barRequired: Inferno.PropTypes.string.isRequired,',
      '    fooRequired: Inferno.PropTypes.any.isRequired,',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onBar: Inferno.PropTypes.func,',
      '    onFoo: Inferno.PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true,
      callbacksLast: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    z: Inferno.PropTypes.string,',
      '    a: Inferno.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    z: Inferno.PropTypes.any,',
      '    Z: Inferno.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    Z: Inferno.PropTypes.any,',
      '    a: Inferno.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    A: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    Z: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    Zz: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = Inferno.createClass({',
      '  propTypes: {',
      '    aAA: Inferno.PropTypes.any,',
      '    ZZ: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    yy: Inferno.PropTypes.any,',
      '    bb: Inferno.PropTypes.string',
      '};',
      'class Second extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    aAA: Inferno.PropTypes.any,',
      '    ZZ: Inferno.PropTypes.string',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'class Component extends Inferno.Component {',
      '  static propTypes = {',
      '    z: Inferno.PropTypes.any,',
      '    y: Inferno.PropTypes.any,',
      '    a: Inferno.PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onFoo: Inferno.PropTypes.func,',
      '    onBar: Inferno.PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Component extends Inferno.Component {',
      '  static propTypes = {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onFoo: Inferno.PropTypes.func,',
      '    onBar: Inferno.PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class First extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: Inferno.PropTypes.any,',
      '    z: Inferno.PropTypes.string,',
      '    onFoo: Inferno.PropTypes.func,',
      '    onBar: Inferno.PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    onBar: Inferno.PropTypes.func,',
      '    onFoo: Inferno.PropTypes.func,',
      '    z: Inferno.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Callback prop types must be listed after all other prop types',
      line: 5,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    fooRequired: Inferno.PropTypes.string.isRequired,',
      '    barRequired: Inferno.PropTypes.string.isRequired,',
      '    a: Inferno.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any,',
      '    barRequired: Inferno.PropTypes.string.isRequired,',
      '    onFoo: Inferno.PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Required prop types must be listed before all other prop types',
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...a.propTypes,',
      '    d: PropTypes.string,',
      '    c: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop types declarations should be sorted alphabetically',
      line: 6,
      column: 5,
      type: 'Property'
    }]
  }]
});
