/**
 * @fileoverview Prevent using unwrapped literals in a Inferno component definition
 * @author Caleb morris
 * @author David Buchan-Swanson
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-literals');

const parsers = require('../../helpers/parsers');

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

function stringsMessage(str) {
  return `Strings not allowed in JSX files: “${str}”`;
}

function jsxMessage(str) {
  return `Missing JSX expression container around literal string: “${str}”`;
}

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-no-literals', rule, {

  valid: [
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <>
                {'asdjfl'}
              </>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{'hello'}</div>);
            return bar;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        var Hello = createClass({
          foo: (<div>{'hello'}</div>),
          render() {
            return this.foo;
          },
        });
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                {'test'}
                {'foo'}
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        var foo = require('foo');
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{noStrings: true}]
    }, {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{noStrings: true}]
    }, {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      options: [{noStrings: true}]
    }, {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={true} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={false} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={100} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={null} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={{}} />',
      options: [{noStrings: true}]
    }, {
      code: `
        class Comp1 extends Component {
          asdf() {}
          render() {
            return <Foo bar={this.asdf} />;
          }
        }
      `,
      options: [{noStrings: true}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            let foo = \`bar\`;
            return <div />;
          }
        }
      `,
      options: [{noStrings: true}]
    }

  ],

  invalid: [
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            const foo = (<div>test</div>);
            return foo;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            const varObjectTest = { testKey : (<div>test</div>) };
            return varObjectTest.testKey;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        var Hello = createClass({
          foo: (<div>hello</div>),
          render() {
            return this.foo;
          },
        });
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('hello')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('asdjfl')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
                test
                foo
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('asdjfl\n                test\n                foo')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                test
                {'foo'}
              </div>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('\'Test\'')}]
    }, {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('\'Test\'')}]
    }, {
      code: `
        <Foo bar="test">
          {'Test' + name}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('\'Test\'')}]
    }, {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('Test')}]
    }, {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('Test')}]
    }, {
      code: `
        <Foo>
          {\`Test\`}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`Test`')}]
    }, {
      code: '<Foo bar={`Test`} />',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`Test`')}]
    }, {
      code: '<Foo bar={`${baz}`} />',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`${baz}`')}]
    }, {
      code: '<Foo bar={`Test ${baz}`} />',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`Test ${baz}`')}]
    }, {
      code: '<Foo bar={`foo` + \'bar\'} />',
      options: [{noStrings: true}],
      errors: [
        {message: stringsMessage('`foo`')},
        {message: stringsMessage('\'bar\'')}
      ]
    }, {
      code: '<Foo bar={`foo` + `bar`} />',
      options: [{noStrings: true}],
      errors: [
        {message: stringsMessage('`foo`')},
        {message: stringsMessage('`bar`')}
      ]
    }, {
      code: '<Foo bar={\'foo\' + `bar`} />',
      options: [{noStrings: true}],
      errors: [
        {message: stringsMessage('\'foo\'')},
        {message: stringsMessage('`bar`')}
      ]
    }
  ]
});
