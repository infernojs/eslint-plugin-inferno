# Lifecycle methods should be methods on the prototype, not class fields (inferno/no-arrow-function-lifecycle)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

🔧 This rule is automatically fixable using the `--fix` [flag](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) on the command line.

It is not necessary to use arrow function for lifecycle methods. This makes things harder to test, conceptually less performant (although in practice, performance will not be affected, since most engines will optimize efficiently), and can break hot reloading patterns.

## Rule Details

The following patterns are considered warnings:

```jsx
class Hello extends Inferno.Component {
  render = () => {
    return <div />;
  }
}

var AnotherHello = createClass({
  render: () => {
    return <div />;
  },
});
```

The following patterns are **not** considered warnings:

```jsx
class Hello extends Inferno.Component {
  render() {
    return <div />;
  }
}

var AnotherHello = createClass({
  render() {
    return <div />;
  },
});

```

## When Not To Use It

If you don't care about performance of your application or conceptual correctness of class property placement, you can disable this rule.
