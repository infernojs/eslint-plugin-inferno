/**
 * @fileoverview Warn about unused PropType definitions in Inferno components
 * @author Evgueni Naverniouk
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-unused-prop-types');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var settings = {
  inferno: {
    pragma: 'Foo'
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unused-prop-types', rule, {

  valid: [
    {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    name: Inferno.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    name: Inferno.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: externalPropTypes.mySharedPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: Inferno.PropTypes.string',
        '};',
        'Hello.propTypes.lastname = Inferno.PropTypes.string;'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    name: Inferno.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    var user = {',
        '      name: this.props.name',
        '    };',
        '    return <div>Hello {user.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello {',
        '  render() {',
        '    return \'Hello\' + this.props.name;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello {',
        '  method;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: Inferno.PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Props validation is ignored when spread is used
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var { firstname, ...props } = this.props;',
        '    var { category, icon } = props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: Inferno.PropTypes.string,',
        '  category: Inferno.PropTypes.string,',
        '  icon: Inferno.PropTypes.bool',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var {firstname, lastname} = this.state, something = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static propTypes = {',
        '    name: Inferno.PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    if (Object.prototype.hasOwnProperty.call(this.props, \'firstname\')) {',
        '      return <div>Hello {this.props.firstname}</div>;',
        '    }',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};',
        'Hello.propTypes.a = Inferno.PropTypes.shape({',
        '  b: Inferno.PropTypes.string',
        '});'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.shape({',
        '    b: Inferno.PropTypes.shape({',
        '    })',
        '  })',
        '};',
        'Hello.propTypes.a.b.c = Inferno.PropTypes.number;'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.objectOf(',
        '    Inferno.PropTypes.shape({',
        '      c: Inferno.PropTypes.number,',
        '      d: Inferno.PropTypes.string,',
        '      e: Inferno.PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.arrayOf(',
        '    Inferno.PropTypes.shape({',
        '      c: Inferno.PropTypes.number,',
        '      d: Inferno.PropTypes.string,',
        '      e: Inferno.PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.oneOfType([',
        '    Inferno.PropTypes.array,',
        '    Inferno.PropTypes.string',
        '  ])',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.c;',
        '    this.props.a[2] === true;',
        '    this.props.a.e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.oneOfType([',
        '    Inferno.PropTypes.shape({',
        '      c: Inferno.PropTypes.number,',
        '      e: Inferno.PropTypes.array',
        '    }).isRequired,',
        '    Inferno.PropTypes.arrayOf(',
        '      Inferno.PropTypes.bool',
        '    )',
        '  ])',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.render;',
        '    this.props.a.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.instanceOf(Hello)',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.arr;',
        '    this.props.arr[3];',
        '    this.props.arr.length;',
        '    this.props.arr.push(3);',
        '    this.props.bo;',
        '    this.props.bo.toString();',
        '    this.props.fu;',
        '    this.props.fu.bind(this);',
        '    this.props.numb;',
        '    this.props.numb.toFixed();',
        '    this.props.stri;',
        '    this.props.stri.length();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  arr: Inferno.PropTypes.array,',
        '  bo: Inferno.PropTypes.bool.isRequired,',
        '  fu: Inferno.PropTypes.func,',
        '  numb: Inferno.PropTypes.number,',
        '  stri: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var { ',
        '      propX,',
        '      "aria-controls": ariaControls, ',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "propX": Inferno.PropTypes.string,',
        '  "aria-controls": Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "some.value": Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props["arr"][1];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": Inferno.PropTypes.array',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props["arr"][1]["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": Inferno.PropTypes.arrayOf(',
        '    Inferno.PropTypes.shape({"some.value": Inferno.PropTypes.string})',
        '  )',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'var TestComp1 = Inferno.createClass({',
        '  propTypes: {',
        '    size: Inferno.PropTypes.string',
        '  },',
        '  render: function() {',
        '    var foo = {',
        '      baz: \'bar\'',
        '    };',
        '    var icons = foo[this.props.size].salut;',
        '    return <div>{icons}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    const {firstname, lastname} = this.props.name;',
        '    return <div>{firstname} {lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape({',
        '    firstname: PropTypes.string,',
        '    lastname: PropTypes.string',
        '  })',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    let {firstname} = this;',
        '    return <div>{firstname}</div>;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    router: Inferno.PropTypes.func',
        '  },',
        '  render: function() {',
        '    var nextPath = this.props.router.getCurrentQuery().nextPath;',
        '    return <div>{nextPath}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    firstname: CustomValidator.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: CustomValidator.map',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator'], skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    outer: Inferno.PropTypes.shape({',
        '      inner: CustomValidator.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator'], skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: Inferno.PropTypes.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator'], skipShapeProps: false}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    name: Inferno.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name.get("test")}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp1.propTypes = {',
        '  prop1: PropTypes.number',
        '};',
        'class Comp2 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp2.propTypes = {',
        '  prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'const SomeComponent = Inferno.createClass({',
        '  propTypes: SomeOtherComponent.propTypes',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  render: function() {',
        '    let { a, ...b } = obj;',
        '    let c = { ...d };',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    var users = this.props.users.find(user => user.name === \'John\');',
        '    return <div>Hello you {users.length}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  users: Inferno.PropTypes.arrayOf(Inferno.PropTypes.object)',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    const {} = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var foo = \'fullname\';',
        '    var { [foo]: firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '  static propTypes = {',
        '    source: PropTypes.object',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source.uri }',
        '  }',
        '  static propTypes = {',
        '    source: PropTypes.object',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Should not be detected as a component
      code: [
        'HelloJohn.prototype.render = function() {',
        '  return Inferno.createVNode(Hello, {',
        '    name: this.props.firstname',
        '  });',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function HelloComponent() {',
        '  class Hello extends Inferno.Component {',
        '    render() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '  Hello.propTypes = { name: Inferno.PropTypes.string };',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function HelloComponent() {',
        '  var Hello = Inferno.createClass({',
        '    propTypes: { name: Inferno.PropTypes.string },',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class DynamicHello extends Component {',
        '  render() {',
        '    const {firstname} = this.props;',
        '    class Hello extends Component {',
        '      render() {',
        '        const {name} = this.props;',
        '        return <div>Hello {name}</div>;',
        '      }',
        '    }',
        '    Hello.propTypes = {',
        '      name: PropTypes.string',
        '    };',
        '    Hello = connectReduxForm({name: firstname})(Hello);',
        '    return <Hello />;',
        '  }',
        '}',
        'DynamicHello.propTypes = {',
        '  firstname: PropTypes.string,',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};',
        'Hello.propTypes = {',
        '  names: Inferno.PropTypes.array,',
        '  company: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'export default {',
        '  renderHello() {',
        '    let {name} = this.props;',
        '    return <div>{name}</div>;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Reassigned props are ignored
      code: [
        'export class Hello extends Component {',
        '  render() {',
        '    const props = this.props;',
        '    return <div>Hello {props.name.firstname} {props[\'name\'].lastname}</div>',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'export default function FooBar(props) {',
        '  const bar = props.bar;',
        '  return (<div bar={bar}><div {...props}/></div>);',
        '}',
        'if (process.env.NODE_ENV !== \'production\') {',
        '  FooBar.propTypes = {',
        '    bar: Inferno.PropTypes.string',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  render: function() {',
        '    var {...other} = this.props;',
        '    return (',
        '      <div {...other} />',
        '    );',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const statelessComponent = (props) => {',
        '  const subRender = () => {',
        '    return <span>{props.someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const statelessComponent = ({ someProp }) => {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const statelessComponent = function({ someProp }) {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'function statelessComponent({ someProp }) {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'function notAComponent({ something }) {',
        '  return something + 1;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const notAComponent = function({ something }) {',
        '  return something + 1;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const notAComponent = ({ something }) => {',
        '  return something + 1;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Validation is ignored on reassigned props object
      code: [
        'const statelessComponent = (props) => {',
        '  let newProps = props;',
        '  return <span>{newProps.someProp}</span>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {',
        '    name: string;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {',
        '    name: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: Object;};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type Props from "fake";',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {',
        '    name: {',
        '      firstname: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
        'class Hello extends Inferno.Component {',
        '  props: {people: Person[];};',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[];};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[]|Person;};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    if (Array.isArray(this.props.people)) {',
        '      for (var i = 0; i < this.props.people.length; i++) {',
        '        names.push(this.props.people[i].name.firstname);',
        '      }',
        '    } else {',
        '      names.push(this.props.people.name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {ok: string | boolean;};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props = {a: 123};',
        '  render () {',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Ignore component validation if propTypes are composed using spread
      code: [
        'class Hello extends Inferno.Component {',
        '    render() {',
        '        return  <div>Hello {this.props.firstName} {this.props.lastName}</div>;',
        '    }',
        '};',
        'const otherPropTypes = {',
        '    lastName: Inferno.PropTypes.string',
        '};',
        'Hello.propTypes = {',
        '    ...otherPropTypes,',
        '    firstName: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Ignore destructured function arguments
      code: [
        'class Hello extends Inferno.Component {',
        '  render () {',
        '    return ["string"].map(({length}) => <div>{length}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Flow annotations on stateless components
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'function Hello(props: Props): Inferno.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'const Hello = function(props: Props): Inferno.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'const Hello = (props: Props): Inferno.Element => {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'Card.propTypes = {',
        '  title: PropTypes.string.isRequired,',
        '  children: PropTypes.element.isRequired,',
        '  footer: PropTypes.node',
        '}',
        'function Card ({ title, children, footer }) {',
        '  return (',
        '    <div/>',
        '  )',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'function JobList(props) {',
        '  props',
        '  .jobs',
        '  .forEach(() => {});',
        '  return <div></div>;',
        '}',
        'JobList.propTypes = {',
        '  jobs: PropTypes.array',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  firstname: ?string,',
        '};',
        'function Hello({firstname}: Props): Inferno$Element {',
        '  return <div>Hello {firstname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function Greetings() {',
        '  return <div>{({name}) => <Hello name={name} />}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function Greetings() {',
        '  return <div>{function({name}) { return <Hello name={name} />; }}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Should stop at the class when searching for a parent component
      code: [
        'export default (ComposedComponent) => class Something extends SomeOtherComponent {',
        '  someMethod = ({width}) => {}',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Should stop at the decorator when searching for a parent component
      code: [
        '@asyncConnect([{',
        '  promise: ({dispatch}) => {}',
        '}])',
        'class Something extends Component {}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured shape props are skipped by default
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    params: PropTypes.shape({',
        '      id: PropTypes.string',
        '    })',
        '   }',
        '  render () {',
        '    const {params} = this.props',
        '    const id = (params || {}).id;',
        '    return <span>{id}</span>',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in componentWillReceiveProps shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps (nextProps) {',
        '    const {something} = nextProps;',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps ({something}) {',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in the constructor shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  constructor (props) {',
        '    super(props);',
        '    const {something} = props;',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the constructor shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  constructor ({something}) {',
        '    super({something});',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `componentWillReceiveProps` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `componentWillReceiveProps` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `shouldComponentUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `shouldComponentUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `componentWillUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, nextState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured state props in `componentDidUpdate` [Issue #825]
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured state props in `componentDidUpdate` without custom parser [Issue #825]
      code: [
        'var Hello = Inferno.Component({',
        '  propTypes: {',
        '    something: PropTypes.bool',
        '  },',
        '  componentDidUpdate: function ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Destructured props in a stateless function
      code: [
        'const Hello = (props) => {',
        '  const {...rest} = props;',
        '  return <div />;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // `no-unused-prop-types` in jsx expressions - [Issue #885]
      code: [
        'const PagingBlock = function(props) {',
        '  return (',
        '    <span>',
        '      <a onClick={() => props.previousPage()}/>',
        '      <a onClick={() => props.nextPage()}/>',
        '    </span>',
        ' );',
        '};',

        'PagingBlock.propTypes = {',
        '  nextPage: Inferno.PropTypes.func.isRequired,',
        '  previousPage: Inferno.PropTypes.func.isRequired,',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // `no-unused-prop-types` rest param props in jsx expressions - [Issue #885]
      code: [
        'const PagingBlock = function(props) {',
        '  return (',
        '    <SomeChild {...props} />',
        ' );',
        '};',

        'PagingBlock.propTypes = {',
        '  nextPage: Inferno.PropTypes.func.isRequired,',
        '  previousPage: Inferno.PropTypes.func.isRequired,',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }
  ],


  invalid: [
    {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    unused: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return Inferno.createVNode("div", {}, this.props.value);',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: false
      },
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    name: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.value}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'name\' PropType is defined but prop is never used',
        line: 3,
        column: 11
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static propTypes = {',
        '    name: PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.value}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'name\' PropType is defined but prop is never used',
        line: 3,
        column: 11
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '};',
        'class HelloBis extends Inferno.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    unused: Inferno.PropTypes.string.isRequired,',
        '    anotherunused: Inferno.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;',
        '  }',
        '});',
        'var Hello2 = Inferno.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }, {
        message: '\'anotherunused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var { firstname, lastname } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.z',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.shape({',
        '    b: PropTypes.string',
        '  })',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{skipShapeProps: false}],
      errors: [{
        message: '\'a.b\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.b.z;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.shape({',
        '    b: Inferno.PropTypes.shape({',
        '      c: Inferno.PropTypes.string',
        '    })',
        '  })',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{skipShapeProps: false}],
      errors: [{
        message: '\'a.b.c\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.objectOf(',
        '    Inferno.PropTypes.shape({',
        '      unused: PropTypes.string',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{skipShapeProps: false}],
      errors: [
        {message: '\'a.*.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.arrayOf(',
        '    Inferno.PropTypes.shape({',
        '      unused: PropTypes.string',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{skipShapeProps: false}],
      errors: [
        {message: '\'a.*.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    this.props.a.b;',
        '    this.props.a.e.length;',
        '    this.props.a.e.anyProp;',
        '    this.props.a.c.toString();',
        '    this.props.a.c.someThingElse();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: Inferno.PropTypes.oneOfType([',
        '    Inferno.PropTypes.shape({',
        '      unused: Inferno.PropTypes.number,',
        '      anotherunused: Inferno.PropTypes.array',
        '    })',
        '  ])',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{skipShapeProps: false}],
      errors: [
        {message: '\'a.unused\' PropType is defined but prop is never used'},
        {message: '\'a.anotherunused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "some.unused": Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: '\'some.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    this.props["arr"][1]["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": Inferno.PropTypes.arrayOf(',
        '    Inferno.PropTypes.shape({',
        '      "some.unused": Inferno.PropTypes.string',
        '})',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{skipShapeProps: false}],
      errors: [
        {message: '\'arr.*.some.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static propTypes = {',
        '    unused: Inferno.PropTypes.string',
        '  }',
        '  render() {',
        '    var text;',
        '    text = \'Hello \';',
        '    let {props: {firstname}} = this;',
        '    return <div>{text} {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  render() {',
        '    if (true) {',
        '      return <span>{this.props.firstname}</span>',
        '    } else {',
        '      return <span>{this.props.lastname}</span>',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'var Hello = function(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'function Hello(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = (props) => {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = (props) => {',
        '  const {name} = props;',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'function Hello({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Hello = function({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Hello = ({ name }) => {',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static propTypes = {unused: PropTypes.string}',
        '  render() {',
        '    var props = {firstname: \'John\'};',
        '    return <div>Hello {props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static propTypes = {unused: PropTypes.string}',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  static propTypes = {unused: PropTypes.string}',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'function HelloComponent() {',
        '  var Hello = Inferno.createClass({',
        '    propTypes: {unused: PropTypes.string},',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Annotation = props => (',
        '  <div>',
        '    {props.text}',
        '  </div>',
        ')',
        'Annotation.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'for (var key in foo) {',
        '  var Hello = Inferno.createClass({',
        '    propTypes: {unused: PropTypes.string},',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'var propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '};',
        'class Test extends Inferno.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = propTypes;'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: settings,
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        '/** @jsx Foo */',
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = {',
        '  unused: Inferno.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {',
        '    unused: PropTypes.string',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {',
        '    unused: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {unused: Object;};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {',
        '    name: {',
        '      unused: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {name: {unused: string;};};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends Inferno.Component {',
        '  props: {person: {name: {unused: string;};};};',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'person.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {person: {name: {unused: string;};};};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'person.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Person = {name: {unused: string;}};',
        'class Hello extends Inferno.Component {',
        '  props: {people: Person[];};',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.lastname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'people.*.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Person = {name: {unused: string;}};',
        'type Props = {people: Person[];};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.lastname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'people.*.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends Inferno.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'result.ok\' PropType is defined but prop is never used'},
          {message: '\'result.ok\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'function Greetings({names}) {',
        '  names = names.map(({firstname, lastname}) => <div>{firstname} {lastname}</div>);',
        '  return <Hello>{names}</Hello>;',
        '}',
        'Greetings.propTypes = {unused: Object};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const MyComponent = props => (',
        '  <div onClick={() => props.toggle()}></div>',
        ')',
        'MyComponent.propTypes = {unused: Object};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const MyComponent = props => props.test ? <div /> : <span />',
        'MyComponent.propTypes = {unused: Object};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'type Props = {',
        '  unused: ?string,',
        '};',
        'function Hello({firstname, lastname}: Props): Inferno$Element {',
        '  return <div>Hello {firstname} {lastname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  constructor (props) {',
        '    super(props);',
        '    const {something} = props;',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  constructor ({something}) {',
        '    super({something});',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, prevState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, prevState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, {state1, state2}) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'something\' PropType is defined but prop is never used',
        line: 3,
        column: 16
      }]
    }, {
      code: [
        'var Hello = Inferno.createClass({',
        '  propTypes: {',
        '    something: PropTypes.bool',
        '  },',
        '  componentDidUpdate: function (prevProps, {state1, state2}) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'something\' PropType is defined but prop is never used',
        line: 3,
        column: 16
      }]
    }/* , {
      // Enable this when the following issue is fixed
      // https://github.com/yannickcr/eslint-plugin-inferno/issues/296
      code: [
        'function Foo(props) {',
        '  const { bar: { nope } } = props;',
        '  return <div test={nope} />;',
        '}',
        'Foo.propTypes = {',
        '  foo: PropTypes.number,',
        '  bar: PropTypes.shape({',
        '    faz: PropTypes.number,',
        '    qaz: PropTypes.object,',
        '  }),',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used'
      }]
    }*/
  ]
});
