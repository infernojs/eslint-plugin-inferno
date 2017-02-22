# Prevent usage of deprecated methods (no-deprecated)

Several methods are deprecated between Inferno versions. This rule will warn you if you try to use a deprecated method. Use the [shared settings](/README.md#configuration) to specify the Inferno version.

## Rule Details

The following patterns are considered warnings:

```jsx
Inferno.render(<MyComponent />, root);

Inferno.unmountComponentAtNode(root);

Inferno.findDOMNode(this.refs.foo);

Inferno.renderToString(<MyComponent />);

Inferno.renderToStaticMarkup(<MyComponent />);
```

The following patterns are not considered warnings:

```jsx
Inferno.render(<MyComponent />, root);

// When [1, {"inferno": "0.13.0"}]
Inferno.findDOMNode(this.refs.foo);
```
