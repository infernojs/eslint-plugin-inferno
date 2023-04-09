# Enforce 'class' or 'className' attributes (`inferno/jsx-props-class-name`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

🔧 This rule is automatically fixable using the `--fix` [flag](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) on the command line.

## Rule Details

This rule will enforce one or the other to keep consistency in your code.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Options

This rule has a string option:
* className: (default) enforces the use of 'className' instead of 'class' in JSX attributes.
```js
...
"inferno/jsx-props-class-name": [<enabled>, "className"]
...
```

* class: enforces the use of 'class' instead of 'className' in JSX attributes.

```js
...
"inferno/jsx-props-class-name": [<enabled>, "class"]
...
```

## When not to use it

If you want to allow both `className` and `class` attributes

### Related rules

- [forbid-component-props](./forbid-component-props.md)
