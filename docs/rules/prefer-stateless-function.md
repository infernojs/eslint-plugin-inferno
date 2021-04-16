# Enforce stateless Inferno Components to be written as a pure function (inferno/prefer-stateless-function)

Stateless functional components are simpler than class based components and will benefit from future Inferno performance optimizations specific to these components.

## Rule Details

This rule will check your class based Inferno components for

* methods/properties other than `displayName`, `propTypes`, `contextTypes`, `defaultProps`, `render` and useless constructor (same detection as ESLint [no-useless-constructor rule](http://eslint.org/docs/rules/no-useless-constructor))
* instance property other than `this.props` and `this.context`
* extension of `Inferno.PureComponent` (if the `ignorePureComponents` flag is true)
* presence of `ref` attribute in JSX
* the use of decorators

If none of these elements are found, the rule will warn you to write this component as a pure function.

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
const Foo = function(props, context) {
  const {
    location
  } = context.router;

  return <div>{props.foo}</div>;
};
```

Examples of **correct** code for this rule, in Inferno:

```jsx
class Foo extends Inferno.Component {
  render() {
    if (!this.props.foo) {
      return null
    }
    return <div>{this.props.foo}</div>;
  }
}
```


## Rule Options

```js
...
"inferno/prefer-stateless-function": [<enabled>, { "ignorePureComponents": <ignorePureComponents> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `ignorePureComponents`: optional boolean set to `true` to ignore components extending from `Inferno.PureComponent` (default to `false`).

### `ignorePureComponents`

When `true` the rule will ignore Components extending from `Inferno.PureComponent` that use `this.props` or `this.context`.

Examples of **correct** code for this rule:

```jsx
class Foo extends Inferno.PureComponent {
  render() {
    return <div>{this.props.foo}</div>;
  }
}

class Bar extends Inferno.PureComponent {
  render() {
    return <div>Baz</div>;
  }
}
```