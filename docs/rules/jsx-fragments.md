# Enforce shorthand or standard form for Inferno fragments (`inferno/jsx-fragments`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

In JSX, a Inferno [fragment] is created either with `<Inferno.Fragment>...</Inferno.Fragment>`, or, using the shorthand syntax, `<>...</>`.

## Rule Details

This rule allows you to enforce one way or the other.

Support for fragments was added in Inferno v6, so the rule will warn on either of these forms if an older Inferno version is specified in [shared settings][shared_settings].

## Rule Options

```js
...
"inferno/jsx-fragments": [<enabled>, <mode>]
...
```

### `syntax` mode

This is the default mode. It will enforce the shorthand syntax for Inferno fragments, with one exception. [Keys or attributes are not supported by the shorthand syntax][short_syntax], so the rule will not warn on standard-form fragments that use those.

Examples of **incorrect** code for this rule:

```jsx
<Inferno.Fragment><Foo /></Inferno.Fragment>
```

Examples of **correct** code for this rule:

```jsx
<><Foo /></>
```

```jsx
<Inferno.Fragment key="key"><Foo /></Inferno.Fragment>
```

### `element` mode

This mode enforces the standard form for Inferno fragments.

Examples of **incorrect** code for this rule:

```jsx
<><Foo /></>
```

Examples of **correct** code for this rule:

```jsx
<Inferno.Fragment><Foo /></Inferno.Fragment>
```

```jsx
<Inferno.Fragment key="key"><Foo /></Inferno.Fragment>
```

[fragments]: https://infernojs.org/docs/api/inferno
