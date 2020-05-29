# Enforce ES5 or ES6 class for Inferno Components (inferno/prefer-es6-class)

Inferno offers you two ways to create traditional components: using the ES5 `create-inferno-class` module or the new ES6 class system. This rule allow you to enforce one way or another.

## Rule Options

```js
...
"inferno/prefer-es6-class": [<enabled>, <mode>]
...
```

### `always` mode

Will enforce ES6 classes for Inferno Components. This is the default mode.

The following patterns are considered warnings:

```jsx
var Hello = createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

The following patterns are **not** considered warnings:

```jsx
class Hello extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

### `never` mode

Will enforce ES5 classes for Inferno Components.

The following patterns are considered warnings:

```jsx
class Hello extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

The following patterns are **not** considered warnings:

```jsx
var Hello = createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```
