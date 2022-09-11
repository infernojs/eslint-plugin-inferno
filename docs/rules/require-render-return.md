# Enforce ES5 or ES6 class for returning value in render function (inferno/require-render-return)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`, `recommended`.

When writing the `render` method in a component it is easy to forget to return the JSX content. This rule will warn if the `return` statement is missing.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
  render() {
    <div>Hello</div>;
  }
});

class Hello extends Inferno.Component {
  render() {
    <div>Hello</div>;
  }
}
```

Examples of **correct** code for this rule:

```jsx
var Hello = createClass({
  render() {
    return <div>Hello</div>;
  }
});

class Hello extends Inferno.Component {
  render() {
    return <div>Hello</div>;
  }
}
```
