# Enforce ES5 or ES6 class for Inferno Components (inferno/prefer-es6-class)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

Inferno offers you two ways to create traditional components: using the ES5 `inferno-create-class` module or the new ES6 class system.

## Rule Details

This rule allows you to enforce one way or another.

## Rule Options

```js
...
"inferno/prefer-es6-class": [<enabled>, <mode>]
...
```

### `always` mode

Will enforce ES6 classes for Inferno Components. This is the default mode.

Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

Examples of **correct** code for this rule:

```jsx
class Hello extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

### `never` mode

Will enforce ES5 classes for Inferno Components.

Examples of **incorrect** code for this rule:

```jsx
class Hello extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

Examples of **correct** code for this rule:

```jsx
var Hello = createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```
