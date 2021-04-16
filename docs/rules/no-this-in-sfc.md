# Prevent `this` from being used in stateless functional components (inferno/no-this-in-sfc)

When using a stateless functional component (SFC), props/context aren't accessed in the same way as a class component or the `create-inferno-class` format. Both props and context are passed as separate arguments to the component instead. Also, as the name suggests, a stateless component does not have state on `this.state`.

Attempting to access properties on `this` can sometimes be valid, but it's very commonly an error caused by unfamiliarity with the differences between the two styles of components, or a missed reference when converting a class component to an SFC.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
function Foo(props) {
  return (
    <div>{this.props.bar}</div>
  );
}
```

```jsx
function Foo(props) {
  const { bar } = this.props;
  return (
    <div>{bar}</div>
  );
}
```

```jsx
function Foo(props, context) {
  return (
    <div>
      {this.context.foo ? this.props.bar : ''}
    </div>
  );
}
```

```jsx
function Foo(props, context) {
  const { foo } = this.context;
  const { bar } = this.props;
  return (
    <div>
      {foo ? bar : ''}
    </div>
  );
}
```

```jsx
function Foo(props) {
  if (this.state.loading) {
    return <Loader />;
  }
  return (
    <div>
      {this.props.bar}
    </div>
  );
}
```

```jsx
function Foo(props) {
  const { loading } = this.state;
  const { bar } = this.props;
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      {bar}
    </div>
  );
}
```

Examples of **correct** code for this rule:

```jsx
function Foo(props) {
  return (
    <div>{props.bar}</div>
  );
}
```

```jsx
function Foo(props) {
  const { bar } = props;
  return (
    <div>{bar}</div>
  );
}
```

```jsx
function Foo({ bar }) {
  return (
    <div>{bar}</div>
  );
}
```

```jsx
function Foo(props, context) {
  return (
    <div>
      {context.foo ? props.bar : ''}
    </div>
  );
}
```

```jsx
function Foo(props, context) {
  const { foo } = context;
  const { bar } = props;
  return (
    <div>
      {foo ? bar : ''}
    </div>
  );
}
```

```jsx
function Foo({ bar }, { foo }) {
  return (
    <div>
      {foo ? bar : ''}
    </div>
  );
}
```
