# Disallow usage of isMounted (inferno/no-is-mounted)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`, `recommended`.

[`isMounted` is an anti-pattern][anti-pattern], is not available when using ES6 classes, and it is on its way to being officially deprecated.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
  handleClick: function() {
    setTimeout(function() {
      if (this.isMounted()) {
        return;
      }
    });
  },
  render: function() {
    return <div onClick={this.handleClick.bind(this)}>Hello</div>;
  }
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = createClass({
  render: function() {
    return <div onClick={this.props.handleClick}>Hello</div>;
  }
});
```
