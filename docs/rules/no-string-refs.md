# Disallow using string references (`inferno/no-string-refs`)

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/infernojs/eslint-plugin-inferno/#shareable-configs).

<!-- end auto-generated rule header -->

Currently, two ways are supported by Inferno to refer to components. The first way, providing a string identifier, is now considered legacy in the official documentation. The documentation now prefers a second method -- referring to components by setting a property on the `this` object in the reference callback.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
 render: function() {
  return <div ref="hello">Hello, world.</div>;
 }
});
```

```jsx
var Hello = createClass({
  componentDidMount: function() {
    var component = this.refs.hello;
    // ...do something with component
  },
  render: function() {
    return <div ref="hello">Hello, world.</div>;
  }
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = createClass({
  componentDidMount: function() {
    var component = this.hello;
    // ...do something with component
  },
  render() {
    return <div ref={(c) => { this.hello = c; }}>Hello, world.</div>;
  }
});
```

## Rule Options

```js
"inferno/no-string-refs": [<enabled>, {"noTemplateLiterals": <boolean>}]
```

### `noTemplateLiterals`

When set to `true`, it will give warning when using template literals for refs.
Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
 render: function() {
  return <div ref={`hello`}>Hello, world.</div>;
 }
});
```

```jsx
var Hello = createClass({
 render: function() {
  return <div ref={`hello${index}`}>Hello, world.</div>;
 }
});
```
