# Prevent direct mutation of this.state (inferno/no-direct-mutation-state)

NEVER mutate `this.state` directly, as calling `setState()` afterwards may replace
the mutation you made. Treat `this.state` as if it were immutable.

The only place that's acceptable to assign this.state is in a ES6 `class` component constructor.

## Rule Details

This rule is aimed to forbid the use of mutating `this.state` directly.

The following patterns are considered warnings:

```jsx
var Hello = Inferno.createClass({
  componentDidMount: function() {
    this.state.name = this.props.name.toUpperCase();
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});

class Hello extends Inferno.Component {
  constructor(props) {
    super(props)

    // Assign at instance creation time, not on a callback
    doSomethingAsync(() => {
      this.state = 'bad';
    });
  }
}
```


The following patterns are **not** considered warnings:

```jsx
var Hello = Inferno.createClass({
  componentDidMount: function() {
    this.setState({
      name: this.props.name.toUpperCase();
    });
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});

class Hello extends Inferno.Component {
  constructor(props) {
    super(props)

    this.state = {
      foo: 'bar',
    }
  }
}
```
