/**
 * @fileoverview Tests for jsx-uses-vars
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const ruleNoUnusedVars = require('../../helpers/getESLintCoreRule')('no-unused-vars');

const rulePreferConst = require('../../helpers/getESLintCoreRule')('prefer-const');

const RuleTester = require('../../helpers/ruleTester');
const getRuleDefiner = require('../../helpers/getRuleDefiner');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
const ruleDefiner = getRuleDefiner(ruleTester);
ruleDefiner.defineRule('inferno/jsx-uses-vars', require('../../../lib/rules/jsx-uses-vars'));

ruleTester.run('no-unused-vars', ruleNoUnusedVars, {
  valid: parsers.all([
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        function foo() {
          var App;
          var bar = Inferno.render(<App/>);
          return bar;
        };
        foo()
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        Inferno.render(<App/>);
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var a = 1;
        Inferno.render(<img src={a} />);
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        function f() {
          return <App />;
        }
        f();
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        <App.Hello />
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        class HelloMessage {};
        <HelloMessage />
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        class HelloMessage {
          render() {
            var HelloMessage = <div>Hello</div>;
            return HelloMessage;
          }
        };
        <HelloMessage />
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        function foo() {
          var App = { Foo: { Bar: {} } };
          var bar = Inferno.render(<App.Foo.Bar/>);
          return bar;
        };
        foo()
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        function foo() {
          var App = { Foo: { Bar: { Baz: {} } } };
          var bar = Inferno.render(<App.Foo.Bar.Baz/>);
          return bar;
        };
        foo()
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var object;
        Inferno.render(<object.Tag />);
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var object;
        Inferno.render(<object.tag />);
      `,
    },
  ].map(parsers.disableNewTS)),
  invalid: parsers.all([
    {
      code: '/* eslint inferno/jsx-uses-vars: 1 */ var App;',
      errors: [{
        message: '\'App\' is defined but never used.',
        suggestions: [{
          messageId: 'removeVar',
          output: '/* eslint inferno/jsx-uses-vars: 1 */ ',
        }],
      }],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        var unused;
        Inferno.render(<App unused=""/>);
      `,
      errors: [{
        message: '\'unused\' is defined but never used.',
        suggestions: [{
          messageId: 'removeVar',
          output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        ${''}
        Inferno.render(<App unused=""/>);
      `,
        }],
      }],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        var Hello;
        Inferno.render(<App:Hello/>);
      `,
      errors: [
        {
          message: '\'App\' is defined but never used.',
          suggestions: [{
            messageId: 'removeVar',
            output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        ${''}
        var Hello;
        Inferno.render(<App:Hello/>);
      `,
          }],
        },
        {
          message: '\'Hello\' is defined but never used.',
          suggestions: [{
            messageId: 'removeVar',
            output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var App;
        ${''}
        Inferno.render(<App:Hello/>);
      `,
          }],
        },
      ],
      features: ['jsx namespace'],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var Button;
        var Input;
        Inferno.render(<Button.Input unused=""/>);
      `,
      errors: [{
        message: '\'Input\' is defined but never used.',
        suggestions: [{
          messageId: 'removeVar',
          output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var Button;
        ${''}
        Inferno.render(<Button.Input unused=""/>);
      `,
        }],
      }],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        class unused {}
      `,
      errors: [{
        message: '\'unused\' is defined but never used.',
        suggestions: [{
          messageId: 'removeVar',
          output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        ${''}
      `,
        }],
      }],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        class HelloMessage {
          render() {
            var HelloMessage = <div>Hello</div>;
            return HelloMessage;
          }
        }
      `,
      errors: [
        {
          message: '\'HelloMessage\' is defined but never used.',
          line: 3,
          suggestions: [{
            messageId: 'removeVar',
            output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        ${''}
      `,
          }],
        },
      ],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        import {Hello} from 'Hello';
        function Greetings() {
          const Hello = require('Hello').default;
          return <Hello />;
        }
        Greetings();
      `,
      errors: [
        {
          message: '\'Hello\' is defined but never used.',
          line: 3,
          suggestions: [{
            messageId: 'removeVar',
            output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        ${''}
        function Greetings() {
          const Hello = require('Hello').default;
          return <Hello />;
        }
        Greetings();
      `,
          }],
        },
      ],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        var lowercase;
        Inferno.render(<lowercase />);
      `,
      errors: [{
        message: '\'lowercase\' is defined but never used.',
        suggestions: [{
          messageId: 'removeVar',
          output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        ${''}
        Inferno.render(<lowercase />);
      `,
        }],
      }],
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars: 1 */
        function Greetings(div) {
          return <div />;
        }
        Greetings();
      `,
      errors: [
        {
          message: '\'div\' is defined but never used.',
          line: 3,
          suggestions: [{
            messageId: 'removeVar',
            output: `
        /* eslint inferno/jsx-uses-vars: 1 */
        function Greetings() {
          return <div />;
        }
        Greetings();
      `,
          }],
        },
      ],
    },
  ].map((test) => {
    if (!ruleNoUnusedVars.meta.hasSuggestions) {
      test.errors = test.errors.map((error) => {
        // https://github.com/eslint/eslint/pull/18352 added suggestions to no-unused-vars in eslint v9.17.0
        delete error.suggestions;
        return error;
      });
    }
    return test;
  })),
});

// Check compatibility with eslint prefer-const rule (#716)
ruleTester.run('prefer-const', rulePreferConst, {
  valid: [],
  invalid: parsers.all([
    {
      code: `
        /* eslint inferno/jsx-uses-vars:1 */
        let App = <div />;
        <App />;
      `,
      errors: [{ message: '\'App\' is never reassigned. Use \'const\' instead.' }],
      output: `
        /* eslint inferno/jsx-uses-vars:1 */
        const App = <div />;
        <App />;
      `,
    },
    {
      code: `
        /* eslint inferno/jsx-uses-vars:1 */
        let filters = 'foo';
        <div>{filters}</div>;
      `,
      errors: [{ message: '\'filters\' is never reassigned. Use \'const\' instead.' }],
      output: `
        /* eslint inferno/jsx-uses-vars:1 */
        const filters = 'foo';
        <div>{filters}</div>;
      `,
    },
  ].map(parsers.disableNewTS)),
});
