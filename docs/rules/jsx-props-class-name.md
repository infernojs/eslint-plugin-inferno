# Enforce 'class' or 'className' Attributes in JSX (inferno/jsx-props-class-name)

This rule will enforce one or the other to keep consistency in your code.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

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
