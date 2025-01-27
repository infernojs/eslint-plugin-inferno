# Disallow file extensions that may contain JSX (`inferno/jsx-filename-extension`)

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
// filename: MyComponent.js
function MyComponent() {
  return <div />;
}
```

Examples of **correct** code for this rule:

```jsx
// filename: MyComponent.jsx
function MyComponent() {
  return <div />;
}
```

Beware this rule **only** reports JSX syntax, **not** other non-standard syntax such as experimental features or type annotations.

## Rule Options

### `allow` (default: `"always"`)

When to allow a JSX filename extension. By default all files may have a JSX extension. Set this to `as-needed` to only allow JSX file extensions in files that contain JSX syntax.

```js
"rules": {
  "inferno/jsx-filename-extension": [1, { "allow": "as-needed" }]
}
```

### `extensions` (default: `[".jsx"]`)

The set of allowed extensions is configurable. By default '.jsx' is allowed. If you wanted to allow both '.jsx' and '.js', the configuration would be:

```js
"rules": {
  "inferno/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
}
```

### `ignoreFilesWithoutCode` (default: `false`)

If enabled, files that do not contain code (i.e. are empty, contain only whitespaces or comments) will not be rejected.

```js
"rules": {
  "inferno/jsx-filename-extension": [1, { "ignoreFilesWithoutCode": true }]
}
```

## When Not To Use It

If you don't care about restricting the file extensions that may contain JSX.
