/**
 * @fileoverview Tests for void-dom-elements-no-children
 * @author Joe Lencioni
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/void-dom-elements-no-children');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

function errorMessage(elementName) {
  return `Void DOM element <${elementName} /> cannot receive children.`;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('void-dom-elements-no-children', rule, {
  valid: [
    {
      code: '<div>Foo</div>;'
    },
    {
      code: '<div children="Foo" />;'
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "Foo" }} />;'
    },
    {
      code: 'Inferno.createElement("div", {}, "Foo");'
    },
    {
      code: 'Inferno.createElement("div", { children: "Foo" });'
    },
    {
      code: 'Inferno.createElement("div", { dangerouslySetInnerHTML: { __html: "Foo" } });'
    }, {
      code: 'document.createElement("img")'
    }, {
      code: 'Inferno.createElement("img");'
    }, {
      code: [
        'const props = {}',
        'Inferno.createElement("img", props)'
      ].join('\n')
    }, {
      code: [
        'import Inferno from "inferno";',
        'const { createElement } = Inferno;',
        'createElement("div")'
      ].join('\n')
    }, {
      code: [
        'import Inferno from "inferno";',
        'const { createElement } = Inferno;',
        'createElement("img")'
      ].join('\n')
    }, {
      code: [
        'import Inferno, {createElement, PureComponent} from \'inferno\';',
        'class Button extends PureComponent {',
        '  handleClick(ev) {',
        '    ev.preventDefault();',
        '  }',
        '  render() {',
        '    return <div onClick={this.handleClick}>Hello</div>;',
        '  }',
        '}'
      ].join('\n')
    }
  ],
  invalid: [
    {
      code: '<br>Foo</br>;',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: '<br children="Foo" />;',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: '<img {...props} children="Foo" />;',
      errors: [{message: errorMessage('img')}]
    },
    {
      code: '<br dangerouslySetInnerHTML={{ __html: "Foo" }} />;',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: 'Inferno.createElement("br", {}, "Foo");',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: 'Inferno.createElement("br", { children: "Foo" });',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: 'Inferno.createElement("br", { dangerouslySetInnerHTML: { __html: "Foo" } });',
      errors: [{message: errorMessage('br')}]
    },
    {
      code: [
        'import Inferno from "inferno";',
        'const createElement = Inferno.createElement;',
        'createElement("img", {}, "Foo");'
      ].join('\n'),
      errors: [{message: errorMessage('img')}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'import Inferno from "inferno";',
        'const createElement = Inferno.createElement;',
        'createElement("img", { children: "Foo" });'
      ].join('\n'),
      errors: [{message: errorMessage('img')}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'import Inferno from "inferno";',
        'const createElement = Inferno.createElement;',
        'createElement("img", { dangerouslySetInnerHTML: { __html: "Foo" } });'
      ].join('\n'),
      errors: [{message: errorMessage('img')}],
      parser: 'babel-eslint'
    }
  ]
});
