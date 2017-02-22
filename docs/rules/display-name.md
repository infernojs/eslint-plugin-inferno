# Prevent missing displayName in a Inferno component definition (display-name)

DisplayName allows you to name your component. This name is used by Inferno in debugging messages.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = Inferno.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

The following patterns are not considered warnings:

```jsx
var Hello = Inferno.createClass({
  displayName: 'Hello',
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

## Rule Options

```js
...
"display-name": [<enabled>, { "ignoreTranspilerName": <boolean> }]
...
```

### `ignoreTranspilerName`

When `true` the rule will ignore the name set by the transpiler and require a `displayName` property in this case.

The following patterns are considered okay and do not cause warnings:

```jsx
var Hello = Inferno.createClass({
  displayName: 'Hello',

  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
module.exports = Hello;
```

```jsx
export default class Hello extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
Hello.displayName = 'Hello';
```

```jsx
export default function Hello({ name }) {
  return <div>Hello {name}</div>;
}
Hello.displayName = 'Hello';
```

The following patterns will cause warnings:

```jsx
var Hello = Inferno.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
module.exports = Hello;
```

```jsx
export default class Hello extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

```jsx
module.exports = Inferno.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

```jsx
export default class extends Inferno.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

```jsx
function HelloComponent() {
  return Inferno.createClass({
    render: function() {
      return <div>Hello {this.props.name}</div>;
    }
  });
}
module.exports = HelloComponent();
```

## About component detection

For this rule to work we need to detect Inferno components, this could be very hard since components could be declared in a lot of ways.

For now we should detect components created with:

* `Inferno.createClass()`
* an ES6 class that inherit from `InfernoComponent` or `Component`
* a stateless function that return JSX or the result of a `Inferno.createVNode` call.
