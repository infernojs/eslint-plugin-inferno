/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-render-return-value');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-render-return-value', rule, {

  valid: [{
    code: 'Inferno.render(<div />, document.body);'
  }, {
    code: `
      let node;
      Inferno.render(<div ref={ref => node = ref}/>, document.body);
    `
  }, {
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);'
  }, {
    code: 'var foo = render(<div />, root)'
  }, {
    code: 'var foo = Inferno.renderder(<div />, root)'
  }],

  invalid: [{
    code: 'var Hello = Inferno.render(<div />, document.body);',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: `
      var o = {
        inst: Inferno.render(<div />, document.body)
      };
    `,
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: `
      function render () {
        return Inferno.render(<div />, document.body)
      }
    `,
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: 'var render = (a, b) => ReactDOM.render(a, b)',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: 'this.o = ReactDOM.render(<div />, document.body);',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: 'var v; v = ReactDOM.render(<div />, document.body);',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: 'var render = (a, b) => Inferno.render(a, b)',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'React'}
    }]
  }, {
    code: 'this.o = Inferno.render(<div />, document.body);',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'ReactDOM'}
    }]
  }, {
    code: 'var v; v = Inferno.render(<div />, document.body);',
    errors: [{
      messageId: 'noReturnValue',
      data: {node: 'React'}
    }]
  }]
});
