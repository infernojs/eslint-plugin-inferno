/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-render-return-value');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-render-return-value', rule, {

  valid: [{
    code: [
      'Inferno.render(<div />, document.body);'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'let node;',
      'Inferno.render(<div ref={ref => node = ref}/>, document.body);'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);',
    parserOptions: parserOptions,
    settings: {
      inferno: {
        version: '0.14.0'
      }
    }
  }, {
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);',
    parserOptions: parserOptions,
    settings: {
      inferno: {
        version: '0.14.0'
      }
    }
  }, {
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);',
    parserOptions: parserOptions,
    settings: {
      inferno: {
        version: '0.13.0'
      }
    }
  }
  ],

  invalid: [{
    code: [
      'var Hello = Inferno.render(<div />, document.body);'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: [
      'var o = {',
      '  inst: Inferno.render(<div />, document.body)',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: [
      'function render () {',
      '  return Inferno.render(<div />, document.body)',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var render = (a, b) => Inferno.render(a, b)',
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var inst = Inferno.render(<div />, document.body);',
    parserOptions: parserOptions,
    settings: {
      inferno: {
        version: '0.14.0'
      }
    },
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var inst = Inferno.render(<div />, document.body);',
    parserOptions: parserOptions,
    settings: {
      inferno: {
        version: '0.14.0'
      }
    },
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var inst = Inferno.render(<div />, document.body);',
    parserOptions: parserOptions,
    settings: {
      inferno: {
        version: '0.13.0'
      }
    },
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }]
});
