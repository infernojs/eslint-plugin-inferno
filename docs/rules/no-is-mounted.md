# inferno/no-is-mounted

📝 Disallow usage of isMounted.

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/infernojs/eslint-plugin-inferno/#shareable-configs).

<!-- end auto-generated rule header -->

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
