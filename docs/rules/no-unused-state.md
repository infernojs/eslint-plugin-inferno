# Prevent definitions of unused state (inferno/no-unused-state)

Warns you if you have defined a property on the state, but it is not being used anywhere.

## Rule Details

The following patterns are considered warnings:

```jsx
class MyComponent extends Inferno.Component {
  state = { foo: 0 };
  render() {
    return <SomeComponent />;
  }
}

var UnusedGetInitialStateTest = createClass({
  getInitialState: function() {
    return { foo: 0 };
  },
  render: function() {
    return <SomeComponent />;
  }
})
```

The following patterns are not considered warnings:

```jsx
class MyComponent extends Inferno.Component {
  state = { foo: 0 };
  render() {
    return <SomeComponent foo={this.state.foo} />;
  }
}

var UnusedGetInitialStateTest = createClass({
  getInitialState: function() {
    return { foo: 0 };
  },
  render: function() {
    return <SomeComponent foo={this.state.foo} />;
  }
})
```
