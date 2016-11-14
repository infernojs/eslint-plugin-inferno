# Prevent missing Inferno when using JSX (inferno-in-jsx-scope)

When using JSX, `<a />` expands to `Inferno.createVNode(2, "a")`. Therefore the
`Inferno` variable must be in scope.

If you are using the @jsx pragma this rule will check the designated variable and not the `Inferno` one.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = <div>Hello {this.props.name}</div>;
```

```js
/** @jsx Foo.bar */
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

The following patterns are not considered warnings:

```js
import Inferno from 'inferno';

var Hello = <div>Hello {this.props.name}</div>;
```

```js
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

```js
/** @jsx Foo.bar */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are setting `Inferno` as a global variable you can disable this rule.
