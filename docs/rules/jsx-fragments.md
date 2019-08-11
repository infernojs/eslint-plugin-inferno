# Enforce shorthand or standard form for Inferno fragments (inferno/jsx-fragments)

In JSX, a Inferno fragment is created either with `<Inferno.Fragment>...</Inferno.Fragment>`, or, using the shorthand syntax, `<>...</>`. This rule allows you to enforce one way or the other.

Support for fragments was added in Inferno v6, so the rule will warn on either of these forms if an older Inferno version is specified in [shared settings][shared_settings].

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Options

```js
...
"inferno/jsx-fragments": [<enabled>, <mode>]
...
```

### `syntax` mode

This is the default mode. It will enforce the shorthand syntax for Inferno fragments, with one exception. [Keys or attributes are not supported by the shorthand syntax][short_syntax], so the rule will not warn on standard-form fragments that use those.

The following pattern is considered a warning:

```jsx
<Inferno.Fragment><Foo /></Inferno.Fragment>
```

The following patterns are **not** considered warnings:

```jsx
<><Foo /></>
```

```jsx
<Inferno.Fragment key="key"><Foo /></Inferno.Fragment>
```

### `element` mode

This mode enforces the standard form for Inferno fragments.

The following pattern is considered a warning:

```jsx
<><Foo /></>
```

The following patterns are **not** considered warnings:

```jsx
<Inferno.Fragment><Foo /></Inferno.Fragment>
```

```jsx
<Inferno.Fragment key="key"><Foo /></Inferno.Fragment>
```

[fragments]: https://infernojs.org/docs/api/inferno
