# Prevent Inferno to be incorrectly marked as unused (inferno/jsx-uses-inferno)

JSX expands to a call to `Inferno.createVNode`, a file which includes `Inferno`
but only uses JSX should consider the `Inferno` variable as used.

If you are using the @jsx pragma this rule will mark the designated variable and not the `Inferno` one.

This rule has no effect if the `no-unused-vars` rule is not enabled.

You can use the [shared settings](/README.md#configuration) to specify a custom pragma.

## Rule Details

The following patterns are considered warnings:

```js
var Inferno = require('inferno');

// nothing to do with Inferno
```

```jsx
/** @jsx Foo */
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

The following patterns are **not** considered warnings:

```jsx
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are not using JSX, if Inferno is declared as global variable or if you do not use the `no-unused-vars` rule then you can disable this rule.
