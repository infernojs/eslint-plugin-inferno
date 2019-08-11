# Prevent multiple component definition per file (inferno/no-multi-comp)

Declaring only one component per file improves readability and reusability of components.

## Rule Details

The following patterns are considered warnings:

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

The following patterns are **not** considered warnings:

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

The following patterns are considered okay and do **not** cause warnings:

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
