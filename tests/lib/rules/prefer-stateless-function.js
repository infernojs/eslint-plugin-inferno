/**
 * @fileoverview Enforce stateless components to be written as a pure function
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/prefer-stateless-function');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('prefer-stateless-function', rule, {
  valid: parsers.all([
    {
      // Already a stateless function
      code: `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `,
    },
    {
      // Already a stateless (arrow) function
      code: 'const Foo = ({foo}) => <div>{foo}</div>;',
    },
    {
      // Extends from PureComponent and uses props
      code: `
        class Foo extends Inferno.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [{ ignorePureComponents: true }],
    },
    {
      // Extends from PureComponent and uses context
      code: `
        class Foo extends Inferno.PureComponent {
          render() {
            return <div>{this.context.foo}</div>;
          }
        }
      `,
      options: [{ ignorePureComponents: true }],
    },
    {
      // Extends from PureComponent in an expression context.
      code: `
        const Foo = class extends Inferno.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      parserOptions,
      options: [{ ignorePureComponents: true }],
    },
    {
      // Has a lifecyle method
      code: `
        class Foo extends Inferno.Component {
          shouldComponentUpdate() {
            return false;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Has a state
      code: `
        class Foo extends Inferno.Component {
          changeState() {
            this.setState({foo: "clicked"});
          }
          render() {
            return <div onClick={this.changeState.bind(this)}>{this.state.foo || "bar"}</div>;
          }
        }
      `,
    },
    {
      // Use refs
      code: `
        class Foo extends Inferno.Component {
          doStuff() {
            this.refs.foo.style.backgroundColor = "red";
          }
          render() {
            return <div ref="foo" onClick={this.doStuff}>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Has an additional method
      code: `
        class Foo extends Inferno.Component {
          doStuff() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Has an empty (no super) constructor
      code: `
        class Foo extends Inferno.Component {
          constructor() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Has a constructor
      code: `
        class Foo extends Inferno.Component {
          constructor() {
            doSpecialStuffs();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Has a constructor (2)
      code: `
        class Foo extends Inferno.Component {
          constructor() {
            foo;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
    },
    {
      // Issue 2187
      code: `
        class Foo extends Inferno.Component {
          constructor(props)

          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['no-default', 'no-babel'],
    },
    {
      // Use this.bar
      code: `
        class Foo extends Inferno.Component {
          render() {
            return <div>{this.bar}</div>;
          }
        }
      `,
    },
    {
      // Use this.bar (destructuring)
      code: `
        class Foo extends Inferno.Component {
          render() {
            let {props:{foo}, bar} = this;
            return <div>{foo}</div>;
          }
        }
      `,
    },
    {
      // Use this[bar]
      code: `
        class Foo extends Inferno.Component {
          render() {
            return <div>{this[bar]}</div>;
          }
        }
      `,
    },
    {
      // Use this['bar']
      code: `
        class Foo extends Inferno.Component {
          render() {
            return <div>{this['bar']}</div>;
          }
        }
      `,
    },
    {
      code: `
        export default (Component) => (
          class Test extends Inferno.Component {
            componentDidMount() {}
            render() {
              return <Component />;
            }
          }
        );
      `,
    },
    {
      // Has childContextTypes
      code: `
        class Foo extends Inferno.Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
        Foo.childContextTypes = {
          color: PropTypes.string
        };
      `,
    },
    {
      // Uses a decorator
      code: `
        @foo
        class Foo extends Inferno.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['decorators'],
    },
    {
      // Uses a called decorator
      code: `
        @foo("bar")
        class Foo extends Inferno.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['decorators'],
    },
    {
      // Uses multiple decorators
      code: `
        @foo
        @bar()
        class Foo extends Inferno.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['decorators'],
    },
    {
      code: `
        class Child extends PureComponent {
          render() {
            return <h1>I don't</h1>;
          }
        }
      `,
      options: [{ ignorePureComponents: true }],
    },
    {
      code: `
        import Inferno, {PureComponent, PropTypes} from 'inferno'

        export default function errorDecorator (options) {
          return WrappedComponent => {
            class Wrapper extends PureComponent {
              static propTypes = {
                error: PropTypes.string
              }
              render () {
                const {error, ...props} = this.props
                if (error) {
                  return <div>Error! {error}</div>
                } else {
                  return <WrappedComponent {...props} />
                }
              }
            }
            return Wrapper
          }
        }
      `,
      features: ['class fields'],
      options: [{ ignorePureComponents: true }],
    },
    {
      code: `
        import Inferno, {PureComponent, PropTypes} from 'inferno'

        export default function errorDecorator (options) {
          return WrappedComponent =>
            class Wrapper extends PureComponent {
              static propTypes = {
                error: PropTypes.string
              }
              render () {
                const {error, ...props} = this.props
                if (error) {
                  return <div>Error! {error}</div>
                } else {
                  return <WrappedComponent {...props} />
                }
              }
            }
        }
      `,
      features: ['class fields'],
      options: [{ ignorePureComponents: true }],
    },
    {
      code: `
        export default function errorDecorator (options) {
          return WrappedComponent =>
            class Wrapper extends Inferno.PureComponent {
              static propTypes = {
                error: PropTypes.string
              }
              render () {
                const {error, ...props} = this.props
                if (error) {
                  return <div>Error! {error}</div>
                } else {
                  return <WrappedComponent {...props} />
                }
              }
            }
        }
      `,
      features: ['class fields'],
      options: [{ ignorePureComponents: true }],
    },
  ]),

  invalid: parsers.all([
    {
      // Only use this.props
      code: `
        class Foo extends Inferno.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          render() {
            return <div>{this['props'].foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.PureComponent {
          render() {
            return <div>foo</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static get displayName() {
            return 'Foo';
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static displayName = 'Foo';
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          props: {
            name: string;
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          constructor() {
            super();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          render() {
            let {props:{foo}, context:{bar}} = this;
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        var Foo = createClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static defaultProps = {
            foo: true
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static get defaultProps() {
            return {
              foo: true
            };
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
        Foo.defaultProps = {
          foo: true
        };
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static contextTypes = {
            foo: PropTypes.boolean
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          static get contextTypes() {
            return {
              foo: PropTypes.boolean
            };
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
    {
      code: `
        class Foo extends Inferno.Component {
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
        Foo.contextTypes = {
          foo: PropTypes.boolean
        };
      `,
      errors: [{ messageId: 'componentShouldBePure' }],
    },
  ]),
});
