/**
 * @fileoverview Tests for forbid-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/forbid-prop-types');
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

var ANY_ERROR_MESSAGE = 'Prop type `any` is forbidden';
var ARRAY_ERROR_MESSAGE = 'Prop type `array` is forbidden';
var NUMBER_ERROR_MESSAGE = 'Prop type `number` is forbidden';
var OBJECT_ERROR_MESSAGE = 'Prop type `object` is forbidden';

var ruleTester = new RuleTester();
ruleTester.run('forbid-prop-types', rule, {

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
      '    s: Inferno.PropTypes.string,',
      '    n: Inferno.PropTypes.number,',
      '    i: Inferno.PropTypes.instanceOf,',
      '    b: Inferno.PropTypes.bool',
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
      '    a: Inferno.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object']
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    o: Inferno.PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    o: Inferno.PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
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
      '  a: Inferno.PropTypes.string,',
      '  b: Inferno.PropTypes.string',
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
      '  elem: PropTypes.instanceOf(HTMLElement)',
      '};'
    ].join('\n'),
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
    parser: 'babel-eslint'
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
      'var Hello = Inferno.createClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends inferno.component {',
      '  static propTypes = {',
      '    intl: Inferno.propTypes.number,',
      '    ...propTypes',
      '  };',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    n: Inferno.PropTypes.number',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: NUMBER_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }],
    options: [{
      forbid: ['number']
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.any.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.array.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.object.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.array,',
      '    o: Inferno.PropTypes.object',
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
      '    s: Inferno.PropTypes.shape({,',
      '      o: Inferno.PropTypes.object',
      '    })',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 1
  }, {
    code: [
      'var First = Inferno.createClass({',
      '  propTypes: {',
      '    a: Inferno.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = Inferno.createClass({',
      '  propTypes: {',
      '    o: Inferno.PropTypes.object',
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
      '    a: Inferno.PropTypes.array,',
      '    o: Inferno.PropTypes.object',
      '};',
      'class Second extends Inferno.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    a: Inferno.PropTypes.array,',
      '    o: Inferno.PropTypes.object',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 4
  }, {
    code: [
      'class Component extends Inferno.Component {',
      '  static propTypes = {',
      '    a: Inferno.PropTypes.array,',
      '    o: Inferno.PropTypes.object',
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
      'var Hello = Inferno.createClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{
      forbid: ['instanceOf']
    }],
    errors: 1
  }, {
    code: [
      'var object = Inferno.PropTypes.object;',
      'var Hello = Inferno.createClass({',
      '  propTypes: {',
      '    retailer: object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{
      forbid: ['object']
    }],
    errors: 1
  }]
});
