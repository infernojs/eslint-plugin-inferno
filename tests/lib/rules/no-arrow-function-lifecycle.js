/**
 * @fileoverview It is not necessary to use arrow function for lifecycle methods
 * @author Tan Nguyen
 */

'use strict';

const semver = require('semver');
const RuleTester = require('eslint').RuleTester;
const eslintPkg = require('eslint/package.json');
const rule = require('../../../lib/rules/no-arrow-function-lifecycle');

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
ruleTester.run('no-arrow-function-lifecycle', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = createClass({
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getDefaultProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getInitialState: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getChildContext: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getDerivedStateFromProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          UNSAFE_componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          UNSAFE_componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          shouldComponentUpdate: function() { return true; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          UNSAFE_componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getSnapshotBeforeUpdate: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidCatch: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUnmount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getDefaultProps() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getInitialState() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getChildContext() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillMount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidMount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate() { return true; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidUpdate() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidCatch() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillUnmount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps = () => { return {}; } // not a lifecycle method
          static getDerivedStateFromProps() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        var Hello = createClass({
          getDerivedStateFromProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        class MyComponent extends Inferno.Component {
          onChange: () => void;
        }
      `,
      features: ['types'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createClass({
          render: () => { return <div />; }
        });
      `,
      errors: [{ message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getDefaultProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getDefaultProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          getDefaultProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getInitialState: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getInitialState is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          getInitialState: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getChildContext: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getChildContext is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          getChildContext: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillMount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          UNSAFE_componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'UNSAFE_componentWillMount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          UNSAFE_componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidMount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentDidMount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentDidMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillReceiveProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          UNSAFE_componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'UNSAFE_componentWillReceiveProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          UNSAFE_componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          shouldComponentUpdate: () => { return true; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'shouldComponentUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          shouldComponentUpdate: function() { return true; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          UNSAFE_componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'UNSAFE_componentWillUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          UNSAFE_componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          getSnapshotBeforeUpdate: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getSnapshotBeforeUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          getSnapshotBeforeUpdate: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidUpdate: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentDidUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentDidUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentDidCatch: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentDidCatch is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentDidCatch: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createClass({
          componentWillUnmount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillUnmount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createClass({
          componentWillUnmount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getDefaultProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getDefaultProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getDefaultProps() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getInitialState = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getInitialState is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getInitialState() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getChildContext = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getChildContext is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getChildContext() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          static getDerivedStateFromProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getDerivedStateFromProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          static getDerivedStateFromProps() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillMount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillMount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'UNSAFE_componentWillMount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidMount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentDidMount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidMount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillReceiveProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'UNSAFE_componentWillReceiveProps is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate = () => { return true; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'shouldComponentUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate() { return true; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'UNSAFE_componentWillUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getSnapshotBeforeUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidUpdate = (prevProps) => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentDidUpdate is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidUpdate(prevProps) {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidCatch = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentDidCatch is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentDidCatch() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillUnmount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillUnmount is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends Inferno.Component {
          handleEventMethods = () => {}
          componentWillUnmount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render = () => <div />
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: semver.satisfies(eslintPkg.version, '> 3') ? `
        class Hello extends Inferno.Component {
          render() { return <div />; }
        }
      ` : `
        class Hello extends Inferno.Component {
          render = () => <div />
        }
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render = () => /*first*/<div />/*second*/
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'render is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: semver.satisfies(eslintPkg.version, '> 3') ? `
        class Hello extends Inferno.Component {
          render() { return /*first*/<div />/*second*/; }
        }
      ` : `
        class Hello extends Inferno.Component {
          render = () => /*first*/<div />/*second*/
        }
      `,
    },
    {
      code: `
        export default class Root extends Component {
          getInitialState = () => ({
            errorImporting: null,
            errorParsing: null,
            errorUploading: null,
            file: null,
            fromExtension: false,
            importSuccess: false,
            isImporting: false,
            isParsing: false,
            isUploading: false,
            parsedResults: null,
            showLongRunningMessage: false,
          });
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'getInitialState is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: semver.satisfies(eslintPkg.version, '> 3') ? `
        export default class Root extends Component {
          getInitialState() { return {
            errorImporting: null,
            errorParsing: null,
            errorUploading: null,
            file: null,
            fromExtension: false,
            importSuccess: false,
            isImporting: false,
            isParsing: false,
            isUploading: false,
            parsedResults: null,
            showLongRunningMessage: false,
          }; }
        }
      ` : `
        export default class Root extends Component {
          getInitialState = () => ({
            errorImporting: null,
            errorParsing: null,
            errorUploading: null,
            file: null,
            fromExtension: false,
            importSuccess: false,
            isImporting: false,
            isParsing: false,
            isUploading: false,
            parsedResults: null,
            showLongRunningMessage: false,
          });
        }
      `,
    },
  ]),
});
