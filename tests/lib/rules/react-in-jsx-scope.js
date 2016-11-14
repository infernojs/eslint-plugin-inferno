/**
 * @fileoverview Tests for inferno-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/inferno-in-jsx-scope');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

var settings = {
  inferno: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('inferno-in-jsx-scope', rule, {
  valid: [
    {code: 'var Inferno, App; <App />;', parserOptions: parserOptions},
    {code: 'var Inferno; <img />;', parserOptions: parserOptions},
    {code: 'var Inferno; <x-gif />;', parserOptions: parserOptions},
    {code: 'var Inferno, App, a=1; <App attr={a} />;', parserOptions: parserOptions},
    {code: 'var Inferno, App, a=1; function elem() { return <App attr={a} />; }', parserOptions: parserOptions},
    {code: 'var Inferno, App; <App />;', parserOptions: parserOptions},
    {code: '/** @jsx Foo */ var Foo, App; <App />;', parserOptions: parserOptions},
    {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;', parserOptions: parserOptions},
    {code: [
      'import Inferno from \'inferno/addons\';',
      'const Button = Inferno.createClass({',
      '  render() {',
      '    return (',
      '      <button {...this.props}>{this.props.children}</button>',
      '    )',
      '  }',
      '});',
      'export default Button;'
    ].join('\n'), parserOptions: parserOptions},
    {code: 'var Foo, App; <App />;', settings: settings, parserOptions: parserOptions}
  ],
  invalid: [{
    code: 'var App, a = <App />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: 'var a = <App />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: 'var a = <img />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: '/** @jsx Inferno.DOM */ var a = <img />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: '/** @jsx Foo.bar */ var Inferno, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: 'var Inferno, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}], settings: settings, parserOptions: parserOptions
  }]
});
