/**
 * @fileoverview Enforce Inferno components to have a shouldComponentUpdate method
 * @author Evgueni Naverniouk
 */
'use strict';

var rule = require('../../../lib/rules/require-optimization');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
};

var MESSAGE = 'Component is not optimized. Please add a shouldComponentUpdate method.';

var ruleTester = new RuleTester();
ruleTester.run('inferno-require-optimization', rule, {
  valid: [{
    code: [
      'class A {}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";' +
      'class YourComponent extends Inferno.Component {' +
      'shouldComponentUpdate () {}' +
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno, {Component} from "inferno";' +
      'class YourComponent extends Component {' +
      'shouldComponentUpdate () {}' +
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno, {Component} from "inferno";',
      '@infernoMixin.decorate(PureRenderMixin)',
      'class YourComponent extends Component {',
      '  componetnDidMount () {}',
      '  render() {}',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";' +
      'Inferno.createClass({' +
      'shouldComponentUpdate: function () {}' +
      '})'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";' +
      'Inferno.createClass({' +
      'mixins: [PureRenderMixin]' +
      '})'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '@infernoMixin.decorate(PureRenderMixin)',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'const FunctionalComponent = function (props) {' +
      'return <div />;' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'function FunctionalComponent(props) {' +
      'return <div />;' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'const FunctionalComponent = (props) => {' +
      'return <div />;' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      '@bar',
      '@pureRender',
      '@foo',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}],
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";' +
      'class YourComponent extends Inferno.PureComponent {}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}],
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno, {PureComponent} from "inferno";' +
      'class YourComponent extends PureComponent {}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'import Inferno from "inferno";' +
      'class YourComponent extends Inferno.Component {}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";',
      'class YourComponent extends Inferno.Component {',
      '  handleClick() {}',
      '  render() {',
      '    return <div onClick={this.handleClick}>123</div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno, {Component} from "inferno";' +
      'class YourComponent extends Component {}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";' +
      'Inferno.createClass({' +
      '})'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'import Inferno from "inferno";' +
      'Inferno.createClass({' +
      'mixins: [RandomMixin]' +
      '})'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '@infernoMixin.decorate(SomeOtherMixin)',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      '@bar',
      '@pure',
      '@foo',
      'class DecoratedComponent extends Component {' +
      '}'
    ].join('\n'),
    errors: [{
      message: MESSAGE
    }],
    parser: 'babel-eslint',
    options: [{allowDecorators: ['renderPure', 'pureRender']}],
    parserOptions: parserOptions
  }]
});
