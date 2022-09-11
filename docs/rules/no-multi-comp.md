# Disallow multiple component definition per file (inferno/no-multi-comp)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

Declaring only one component per file improves readability and reusability of components.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

var HelloJohn = createClass({
  render: function() {
    return <Hello name="John" />;
  }
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = require('./components/Hello');

var HelloJohn = createClass({
  render: function() {
    return <Hello name="John" />;
  }
});
```

## Rule Options

```js
...
"inferno/no-multi-comp": [<enabled>, { "ignoreStateless": <boolean> }]
...
```

### `ignoreStateless`

When `true` the rule will ignore stateless components and will allow you to have multiple stateless components, or one stateful component and some stateless components in the same file.

Examples of **correct** code for this rule:

```jsx
function Hello(props) {
  return <div>Hello {props.name}</div>;
}
function HelloAgain(props) {
  return <div>Hello again {props.name}</div>;
}
```

```jsx
function Hello(props) {
  return <div>Hello {props.name}</div>;
}
class HelloJohn extends Inferno.Component {
  render() {
    return <Hello name="John" />;
  }
}
module.exports = HelloJohn;
```

## When Not To Use It

If you prefer to declare multiple components per file you can disable this rule.
