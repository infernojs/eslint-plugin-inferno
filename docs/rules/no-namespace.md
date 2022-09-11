# Enforce that namespaces are not used in Inferno elements (inferno/no-namespace)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

Enforces the absence of a namespace in Inferno elements, such as with `svg:circle`, as they are not supported in Inferno.

## Rule Details

The following patterns are considered warnings:

```jsx
<ns:TestComponent />
```

```jsx
<Ns:TestComponent />
```

The following patterns are **not** considered warnings:

```jsx
<TestComponent />
```

```jsx
<testComponent />
```
