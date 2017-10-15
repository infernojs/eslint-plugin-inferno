/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('../../../lib/rules/jsx-no-undef');
const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
ruleTester.run('jsx-no-undef', rule, {
  valid: [{
    code: '/*eslint no-undef:1*/ var Inferno, App; Inferno.render(<App />);'
  }, {
    code: '/*eslint no-undef:1*/ var Inferno, App; Inferno.render(<App />);'
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<img />);'
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<x-gif />);'
  }, {
    code: '/*eslint no-undef:1*/ var Inferno, app; Inferno.render(<app.Foo />);'
  }, {
    code: '/*eslint no-undef:1*/ var Inferno, app; Inferno.render(<app.foo.Bar />);'
  }, {
    code: `
      /*eslint no-undef:1*/
      var Inferno;
      class Hello extends Inferno.Component {
        render() {
          return <this.props.tag />
        }
      }
    `
  }, {
    code: 'var Inferno; Inferno.render(<Text />);',
    globals: {
      Text: true
    }
  }, {
    code: `
      import Text from "cool-module";
      const TextWrapper = function (props) {
        return (
          <Text />
        );
      };
    `,
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions),
    options: [{
      allowGlobals: false
    }],
    parser: 'babel-eslint'
  }],
  invalid: [{
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<App />);',
    errors: [{
      message: '\'App\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<Appp.Foo />);',
    errors: [{
      message: '\'Appp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<Apppp:Foo />);',
    errors: [{
      message: '\'Apppp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<appp.Foo />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<appp.foo.Bar />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }]
  }, {
    code: `
      const TextWrapper = function (props) {
        return (
          <Text />
        );
      };
      export default TextWrapper;
    `,
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions),
    errors: [{
      message: '\'Text\' is not defined.'
    }],
    options: [{
      allowGlobals: false
    }],
    parser: 'babel-eslint',
    globals: {
      Text: true
    }
  }, {
    code: '/*eslint no-undef:1*/ var Inferno; Inferno.render(<Foo />);',
    errors: [{
      message: '\'Foo\' is not defined.'
    }]
  }]
});
