/**
 * @fileoverview Tests for inferno-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/inferno-in-jsx-scope');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  inferno: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('inferno-in-jsx-scope', rule, {
  valid: [
    {code: 'var Inferno, App; <App />;'},
    {code: 'var Inferno; <img />;'},
    {code: 'var Inferno; <>fragment</>;', parser: parsers.BABEL_ESLINT},
    {code: 'var Inferno; <x-gif />;'},
    {code: 'var Inferno, App, a=1; <App attr={a} />;'},
    {code: 'var Inferno, App, a=1; function elem() { return <App attr={a} />; }'},
    {
      code: 'var Inferno, App; <App />;',
      parser: parsers.BABEL_ESLINT
    },
    {code: '/** @jsx Foo */ var Foo, App; <App />;'},
    {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;'},
    {
      code: `
      import Inferno from 'inferno/addons';
      const Button = createClass({
        render() {
          return (
            <button {...this.props}>{this.props.children}</button>
          )
        }
      });
      export default Button;
    `
    },
    {code: 'var Foo, App; <App />;', settings}
  ],
  invalid: [{
    code: 'var App, a = <App />;',
    errors: [{
      messageId: 'notInScope',
      data: {name: 'React'}
    }]
  }, {
    code: 'var a = <App />;',
    errors: [{
      messageId: 'notInScope',
      data: {name: 'React'}
    }]
  }, {
    code: 'var a = <img />;',
    errors: [{
      messageId: 'notInScope',
      data: {name: 'React'}
    }]
  }, {
    code: 'var a = <>fragment</>;',
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'notInScope',
      data: {name: 'React'}
    }]
  }, {
    code: '/** @jsx Inferno.DOM */ var a = <img />;',
    errors: [{
      messageId: 'notInScope',
      data: {name: 'React'}
    }]
  }, {
    code: '/** @jsx Foo.bar */ var Inferno, a = <img />;',
    errors: [{
      messageId: 'notInScope',
      data: {name: 'Foo'}
    }]
  }, {
    code: 'var Inferno, a = <img />;',
    errors: [{
      messageId: 'notInScope',
      data: {name: 'Foo'}
    }],
    settings
  }]
});
