/**
 * @fileoverview Tests for no-unused-state
 */

'use strict';

const rule = require('../../../lib/rules/no-unused-state');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true,
    experimentalObjectRestSpread: true
  }
};

const eslintTester = new RuleTester({parserOptions});

function getErrorMessages(unusedFields) {
  return unusedFields.map(field => ({
    message: `Unused state field: '${field}'`
  }));
}

eslintTester.run('no-unused-state', rule, {
  valid: [
    `function StatelessFnUnaffectedTest(props) {
       return <SomeComponent foo={props.foo} />;
    };`,
    `var NoStateTest = Inferno.createClass({
      render: function() {
        return <SomeComponent />;
      }
    });`,
    `var NoStateMethodTest = Inferno.createClass({
      render() {
        return <SomeComponent />;
      }
    });`,
    `var GetInitialStateTest = Inferno.createClass({
      getInitialState: function() {
        return { foo: 0 };
      },
      render: function() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var ComputedKeyFromVariableTest = Inferno.createClass({
      getInitialState: function() {
        return { [foo]: 0 };
      },
      render: function() {
        return <SomeComponent />;
      }
    });`,
    `var ComputedKeyFromBooleanLiteralTest = Inferno.createClass({
      getInitialState: function() {
        return { [true]: 0 };
      },
      render: function() {
        return <SomeComponent foo={this.state[true]} />;
      }
    });`,
    `var ComputedKeyFromNumberLiteralTest = Inferno.createClass({
      getInitialState: function() {
        return { [123]: 0 };
      },
      render: function() {
        return <SomeComponent foo={this.state[123]} />;
      }
    });`,
    `var ComputedKeyFromExpressionTest = Inferno.createClass({
      getInitialState: function() {
        return { [foo + bar]: 0 };
      },
      render: function() {
        return <SomeComponent />;
      }
    });`,
    `var ComputedKeyFromBinaryExpressionTest = Inferno.createClass({
      getInitialState: function() {
        return { ['foo' + 'bar' * 8]: 0 };
      },
      render: function() {
        return <SomeComponent />;
      }
    });`,
    `var ComputedKeyFromStringLiteralTest = Inferno.createClass({
      getInitialState: function() {
        return { ['foo']: 0 };
      },
      render: function() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var ComputedKeyFromTemplateLiteralTest = Inferno.createClass({
      getInitialState: function() {
        return { [\`foo\${bar}\`]: 0 };
      },
      render: function() {
        return <SomeComponent />;
      }
    });`,
    `var ComputedKeyFromTemplateLiteralTest = Inferno.createClass({
      getInitialState: function() {
        return { [\`foo\`]: 0 };
      },
      render: function() {
        return <SomeComponent foo={this.state['foo']} />;
      }
    });`,
    `var GetInitialStateMethodTest = Inferno.createClass({
      getInitialState() {
        return { foo: 0 };
      },
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var SetStateTest = Inferno.createClass({
      onFooChange(newFoo) {
        this.setState({ foo: newFoo });
      },
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var MultipleSetState = Inferno.createClass({
      getInitialState() {
        return { foo: 0 };
      },
      update() {
        this.setState({foo: 1});
      },
      render() {
        return <SomeComponent onClick={this.update} foo={this.state.foo} />;
      }
    });`,
    `class NoStateTest extends Inferno.Component {
      render() {
        return <SomeComponent />;
      }
    }`,
    `class CtorStateTest extends Inferno.Component {
      constructor() {
        this.state = { foo: 0 };
      }
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    }`,
    `class ComputedKeyFromVariableTest extends Inferno.Component {
      constructor() {
        this.state = { [foo]: 0 };
      }
      render() {
        return <SomeComponent />;
      }
    }`,
    `class ComputedKeyFromBooleanLiteralTest extends Inferno.Component {
      constructor() {
        this.state = { [false]: 0 };
      }
      render() {
        return <SomeComponent foo={this.state['false']} />;
      }
    }`,
    `class ComputedKeyFromNumberLiteralTest extends Inferno.Component {
      constructor() {
        this.state = { [345]: 0 };
      }
      render() {
        return <SomeComponent foo={this.state[345]} />;
      }
    }`,
    `class ComputedKeyFromExpressionTest extends Inferno.Component {
      constructor() {
        this.state = { [foo + bar]: 0 };
      }
      render() {
        return <SomeComponent />;
      }
    }`,
    `class ComputedKeyFromBinaryExpressionTest extends Inferno.Component {
      constructor() {
        this.state = { [1 + 2 * 8]: 0 };
      }
      render() {
        return <SomeComponent />;
      }
    }`,
    `class ComputedKeyFromStringLiteralTest extends Inferno.Component {
      constructor() {
        this.state = { ['foo']: 0 };
      }
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    }`,
    `class ComputedKeyFromTemplateLiteralTest extends Inferno.Component {
      constructor() {
        this.state = { [\`foo\${bar}\`]: 0 };
      }
      render() {
        return <SomeComponent />;
      }
    }`,
    `class ComputedKeyFromTemplateLiteralTest extends Inferno.Component {
      constructor() {
        this.state = { [\`foo\`]: 0 };
      }
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    }`,
    `class SetStateTest extends Inferno.Component {
        onFooChange(newFoo) {
          this.setState({ foo: newFoo });
        }
        render() {
          return <SomeComponent foo={this.state.foo} />;
        }
      }`,
    {
      code: `class ClassPropertyStateTest extends Inferno.Component {
          state = { foo: 0 };
          render() {
            return <SomeComponent foo={this.state.foo} />;
          }
        }`,
      parser: 'babel-eslint'
    },
    `class VariableDeclarationTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const foo = this.state.foo;
          return <SomeComponent foo={foo} />;
        }
      }`,
    `class DestructuringTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {foo: myFoo} = this.state;
          return <SomeComponent foo={myFoo} />;
        }
      }`,
    `class ShorthandDestructuringTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {foo} = this.state;
          return <SomeComponent foo={foo} />;
        }
      }`,
    `class AliasDeclarationTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const state = this.state;
          return <SomeComponent foo={state.foo} />;
        }
      }`,
    `class AliasAssignmentTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          let state;
          state = this.state;
          return <SomeComponent foo={state.foo} />;
        }
      }`,
    `class DestructuringAliasTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {state: myState} = this;
          return <SomeComponent foo={myState.foo} />;
        }
      }`,
    `class ShorthandDestructuringAliasTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {state} = this;
          return <SomeComponent foo={state.foo} />;
        }
      }`,
    `class RestPropertyTest extends Inferno.Component {
        constructor() {
          this.state = {
            foo: 0,
            bar: 1,
          };
        }
        render() {
          const {foo, ...others} = this.state;
          return <SomeComponent foo={foo} bar={others.bar} />;
        }
      }`,
    {
      code: `class DeepDestructuringTest extends Inferno.Component {
        state = { foo: 0, bar: 0 };
        render() {
          const {state: {foo, ...others}} = this;
          return <SomeComponent foo={foo} bar={others.bar} />;
        }
      }`,
      parser: 'babel-eslint'
    },
    // A cleverer analysis might recognize that the following should be errors,
    // but they're out of scope for this lint rule.
    `class MethodArgFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        consumeFoo(foo) {}
        render() {
          this.consumeFoo(this.state.foo);
          return <SomeComponent />;
        }
      }`,
    `class AssignedToObjectFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const obj = { foo: this.state.foo, bar: 0 };
          return <SomeComponent bar={obj.bar} />;
        }
      }`,
    `class ComputedAccessFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0, bar: 1 };
        }
        render() {
          const bar = \'bar\';
          return <SomeComponent bar={this.state[bar]} />;
        }
      }`,
    `class JsxSpreadFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          return <SomeComponent {...this.state} />;
        }
      }`,
    `class AliasedJsxSpreadFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const state = this.state;
          return <SomeComponent {...state} />;
        }
      }`,
    `class ObjectSpreadFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const attrs = { ...this.state, foo: 1 };
          return <SomeComponent foo={attrs.foo} />;
        }
      }`,
    `class ShadowingFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const state = this.state;
          let foo;
          {
            const state = { foo: 5 };
            foo = state.foo;
          }
          return <SomeComponent foo={foo} />;
        }
      }`,
    {
      code: `class TypeCastExpressionSpreadFalseNegativeTest extends Inferno.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          return <SomeComponent {...(this.state: any)} />;
        }
      }`,
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: `var UnusedGetInitialStateTest = Inferno.createClass({
          getInitialState: function() {
            return { foo: 0 };
          },
          render: function() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `var UnusedComputedStringLiteralKeyStateTest = Inferno.createClass({
          getInitialState: function() {
            return { ['foo']: 0 };
          },
          render: function() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `var UnusedComputedTemplateLiteralKeyStateTest = Inferno.createClass({
          getInitialState: function() {
            return { [\`foo\`]: 0 };
          },
          render: function() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `var UnusedComputedNumberLiteralKeyStateTest = Inferno.createClass({
          getInitialState: function() {
            return { [123]: 0 };
          },
          render: function() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['123'])
    },
    {
      code: `var UnusedComputedBooleanLiteralKeyStateTest = Inferno.createClass({
          getInitialState: function() {
            return { [true]: 0 };
          },
          render: function() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['true'])
    },
    {
      code: `var UnusedGetInitialStateMethodTest = Inferno.createClass({
          getInitialState() {
            return { foo: 0 };
          },
          render() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `var UnusedSetStateTest = Inferno.createClass({
          onFooChange(newFoo) {
            this.setState({ foo: newFoo });
          },
          render() {
            return <SomeComponent />;
          }
        });`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class UnusedCtorStateTest extends Inferno.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class UnusedSetStateTest extends Inferno.Component {
          onFooChange(newFoo) {
            this.setState({ foo: newFoo });
          }
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class UnusedClassPropertyStateTest extends Inferno.Component {
          state = { foo: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedComputedStringLiteralKeyStateTest extends Inferno.Component {
          state = { ['foo']: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedComputedTemplateLiteralKeyStateTest extends Inferno.Component {
          state = { [\`foo\`]: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedComputedTemplateLiteralKeyStateTest extends Inferno.Component {
          state = { [\`foo \\n bar\`]: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo \\n bar']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedComputedBooleanLiteralKeyStateTest extends Inferno.Component {
          state = { [true]: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['true']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedComputedNumberLiteralKeyStateTest extends Inferno.Component {
          state = { [123]: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['123']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedComputedFloatLiteralKeyStateTest extends Inferno.Component {
          state = { [123.12]: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['123.12']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedStateWhenPropsAreSpreadTest extends Inferno.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          render() {
            return <SomeComponent {...this.props} />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class AliasOutOfScopeTest extends Inferno.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          render() {
            const state = this.state;
            return <SomeComponent />;
          }
          someMethod() {
            const outOfScope = state.foo;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class MultipleErrorsTest extends Inferno.Component {
          constructor() {
            this.state = {
              foo: 0,
              bar: 1,
              baz: 2,
              qux: 3,
            };
          }
          render() {
            let {state} = this;
            return <SomeComponent baz={state.baz} qux={state.qux} />;
          }
        }`,
      errors: getErrorMessages(['foo', 'bar'])
    },
    {
      code: `class MultipleErrorsForSameKeyTest extends Inferno.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          onFooChange(newFoo) {
            this.setState({ foo: newFoo });
          }
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo', 'foo'])
    },
    {
      code: `class UnusedRestPropertyFieldTest extends Inferno.Component {
          constructor() {
            this.state = {
              foo: 0,
              bar: 1,
            };
          }
          render() {
            const {bar, ...others} = this.state;
            return <SomeComponent bar={bar} />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class TypeCastExpressionTest extends Inferno.Component {
          constructor() {
            this.state = {
              foo: 0,
              bar: 1,
              baz: 2,
              qux: 3,
            };
          }
          render() {
            const foo = ((this: any).state: any).foo;
            const {bar, ...others} = (this.state: any);
            let baz;
            baz = (others: any)[\'baz\'];
            return <SomeComponent foo={foo} bar={bar} baz={baz} />;
          }
        }`,
      errors: getErrorMessages(['qux']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedDeepDestructuringTest extends Inferno.Component {
          state = { foo: 0, bar: 0 };
          render() {
            const {state: {foo}} = this;
            return <SomeComponent foo={foo} />;
          }
        }`,
      errors: getErrorMessages(['bar']),
      parser: 'babel-eslint'
    }
  ]
});
