/**
 * @fileoverview Enforce Inferno components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/require-optimization');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('inferno-require-optimization', rule, {
  valid: parsers.all([
    {
      code: `
        class A {}
      `,
    },
    {
      code: `
        import Inferno from "inferno";
        class YourComponent extends Inferno.Component {
          shouldComponentUpdate () {}
        }
      `,
    },
    {
      code: `
        import Inferno, {Component} from "inferno";
        class YourComponent extends Component {
          shouldComponentUpdate () {}
        }
      `,
    },
    {
      code: `
        import Inferno, {Component} from "inferno";
        @infernoMixin.decorate(PureRenderMixin)
        class YourComponent extends Component {
          componetnDidMount () {}
          render() {}
        }
      `,
      features: ['decorators'],
    },
    {
      code: `
        import Inferno from "inferno";
        createClass({
          shouldComponentUpdate: function () {}
        })
      `,
    },
    {
      code: `
        import Inferno from "inferno";
        createClass({
          mixins: [PureRenderMixin]
        })
      `,
    },
    {
      code: `
        @infernoMixin.decorate(PureRenderMixin)
        class DecoratedComponent extends Component {}
      `,
      features: ['decorators'],
    },
    {
      code: `
        const FunctionalComponent = function (props) {
          return <div />;
        }
      `,
    },
    {
      code: `
        function FunctionalComponent(props) {
          return <div />;
        }
      `,
    },
    {
      code: `
        const FunctionalComponent = (props) => {
          return <div />;
        }
      `,
    },
    {
      code: `
        @bar
        @pureRender
        @foo
        class DecoratedComponent extends Component {}
      `,
      features: ['decorators'],
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
    {
      code: `
        import Inferno from "inferno";
        class YourComponent extends Inferno.PureComponent {}
      `,
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
    {
      code: `
        import Inferno, {PureComponent} from "inferno";
        class YourComponent extends PureComponent {}
      `,
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
    {
      code: `
        const obj = { prop: [,,,,,] }
      `,
    },
    {
      code: `
        import Inferno from "inferno";
        class YourComponent extends Inferno.Component {
          handleClick = () => {}
          shouldComponentUpdate(){
            return true;
          }
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        import Inferno from "inferno";
        class YourComponent extends Inferno.Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import Inferno from "inferno";
        class YourComponent extends Inferno.Component {
          handleClick() {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import Inferno from "inferno";
        class YourComponent extends Inferno.Component {
          handleClick = () => {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import Inferno, {Component} from "inferno";
        class YourComponent extends Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import Inferno from "inferno";
        createClass({})
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        import Inferno from "inferno";
        createClass({
          mixins: [RandomMixin]
        })
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
    },
    {
      code: `
        @infernoMixin.decorate(SomeOtherMixin)
        class DecoratedComponent extends Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
      features: ['decorators'],
    },
    {
      code: `
        @bar
        @pure
        @foo
        class DecoratedComponent extends Component {}
      `,
      errors: [{ messageId: 'noShouldComponentUpdate' }],
      features: ['decorators'],
      options: [{ allowDecorators: ['renderPure', 'pureRender'] }],
    },
  ]),
});
