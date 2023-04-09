# Disallow missing Inferno when using JSX (`inferno/inferno-in-jsx-scope`)

🚫 This rule is _disabled_ in the 🏃 `jsx-runtime` [config](https://github.com/jsx-eslint/eslint-plugin-react/#shareable-configs).

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`. This rule is disabled in the following configs: `jsx-runtime`.

Note:
This rule is not part of recommended set, because `babel-plugin-inferno` can handle inferno import declaration automatically.
Import inferno only if your code needs it.

When using JSX, `<a />` expands to `Inferno.createElement("a")`. Therefore, the `Inferno` variable must be in scope.

If you are using the @jsx pragma this rule will check the designated variable and not the `Inferno` one.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var Inferno = require('inferno');

var Hello = <div>Hello {this.props.name}</div>;
```

Examples of **correct** code for this rule:

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
