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
  ecmaVersion: 8,
  sourceType: 'module',
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

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('inferno-in-jsx-scope', rule, {
  valid: [
    {code: 'var Inferno, App; <App />;'},
    {code: 'var Inferno; <img />;'},
    {code: 'var Inferno; <x-gif />;'},
    {code: 'var Inferno, App, a=1; <App attr={a} />;'},
    {code: 'var Inferno, App, a=1; function elem() { return <App attr={a} />; }'},
    {code: 'var Inferno, App; <App />;'},
    {code: '/** @jsx Foo */ var Foo, App; <App />;'},
    {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;'},
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
    ].join('\n')},
    {code: 'var Foo, App; <App />;', settings: settings}
  ],
  invalid: [{
    code: 'var App, a = <App />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}]
  }, {
    code: 'var a = <App />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}]
  }, {
    code: 'var a = <img />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}]
  }, {
    code: '/** @jsx Inferno.DOM */ var a = <img />;',
    errors: [{message: '\'Inferno\' must be in scope when using JSX'}]
  }, {
    code: '/** @jsx Foo.bar */ var Inferno, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}]
  }, {
    code: 'var Inferno, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}], settings: settings
  }]
});
