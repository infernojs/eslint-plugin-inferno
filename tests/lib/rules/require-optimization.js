/**
 * @fileoverview Enforce Inferno components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */
'use strict';

const rule = require('../../../lib/rules/require-optimization');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const MESSAGE = 'Component is not optimized. Please add a shouldComponentUpdate method.';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('inferno-require-optimization', rule, {
  valid: [{
    code: `
      class A {}
    `
  }, {
    code: `
      import Inferno from "inferno";
      class YourComponent extends Inferno.Component {
        shouldComponentUpdate () {}
      }
    `
  }, {
    code: `
      import Inferno, {Component} from "inferno";
      class YourComponent extends Component {
        shouldComponentUpdate () {}
      }
    `
  }, {
    code: `
      import Inferno from "inferno";
      Inferno.createClass({
        shouldComponentUpdate: function () {}
      })
    `
  }, {
    code: `
      import Inferno from "inferno";
      Inferno.createClass({
        mixins: [PureRenderMixin]
      })
    `
  }, {
    code: `
      const FunctionalComponent = function (props) {
        return <div />;
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      function FunctionalComponent(props) {
        return <div />;
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      const FunctionalComponent = (props) => {
        return <div />;
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      @bar
      @pureRender
      @foo
      class DecoratedComponent extends Component {}
    `,
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: `
      import Inferno from "inferno";
      class YourComponent extends Inferno.PureComponent {}
    `,
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: `
      import Inferno, {PureComponent} from "inferno";
      class YourComponent extends PureComponent {}
    `,
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }, {
    code: `
      const obj = { prop: [,,,,,] }
    `
  }],

  invalid: [{
    code: `
      import Inferno from "inferno";
      class YourComponent extends Inferno.Component {}
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import Inferno from "inferno";
      class YourComponent extends Inferno.Component {
        handleClick() {}
        render() {
          return <div onClick={this.handleClick}>123</div>
        }
      }
    `,
    parser: 'babel-eslint',
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import Inferno, {Component} from "inferno";
      class YourComponent extends Component {}
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import Inferno from "inferno";
      Inferno.createClass({})
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      import Inferno from "inferno";
      Inferno.createClass({
        mixins: [RandomMixin]
      })
    `,
    errors: [{
      message: MESSAGE
    }]
  }, {
    code: `
      @bar
      @pure
      @foo
      class DecoratedComponent extends Component {}
    `,
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}]
  }]
});
