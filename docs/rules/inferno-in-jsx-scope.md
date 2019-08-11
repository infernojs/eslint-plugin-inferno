# Prevent missing Inferno when using JSX (inferno/inferno-in-jsx-scope)

Note:
This rule is not part of recommended set, because `babel-plugin-inferno` can handle inferno import declaration by itself.
Import inferno only if your code needs it.

When using JSX, `<a />` expands to `Inferno.createElement("a")`. Therefore the
`Inferno` variable must be in scope.

If you are using the @jsx pragma this rule will check the designated variable and not the `Inferno` one.

## Rule Details

The following patterns are considered warnings:

```jsx
var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

The following patterns are **not** considered warnings:

```jsx
import Inferno from 'inferno';

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are setting `Inferno` as a global variable you can disable this rule.
