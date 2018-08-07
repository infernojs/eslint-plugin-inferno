/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-render-return-value');
const RuleTester = require('eslint').RuleTester;

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
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);',
    settings: {
      inferno: {
      }
    }
  }, {
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);',
    settings: {
      inferno: {
      }
    }
  }, {
    code: 'Inferno.render(<div ref={ref => this.node = ref}/>, document.body);',
    settings: {
      inferno: {
      }
    }
  }],

  invalid: [{
    code: 'var Hello = Inferno.render(<div />, document.body);',
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: `
      var o = {
        inst: Inferno.render(<div />, document.body)
      };
    `,
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: `
      function render () {
        return Inferno.render(<div />, document.body)
      }
    `,
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var render = (a, b) => Inferno.render(a, b)',
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var inst = Inferno.render(<div />, document.body);',
    settings: {
      inferno: {
      }
    },
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var inst = Inferno.render(<div />, document.body);',
    settings: {
      inferno: {
      }
    },
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }, {
    code: 'var inst = Inferno.render(<div />, document.body);',
    settings: {
      inferno: {
      }
    },
    errors: [{
      message: 'Do not depend on the return value from Inferno.render'
    }]
  }]
});
