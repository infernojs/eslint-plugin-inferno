# Enforce propTypes declarations alphabetical sorting (sort-prop-types)

Some developers prefer to sort propTypes declarations alphabetically to be able to find necessary declaration easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all components and verifies that all propTypes declarations are sorted alphabetically. A spread attribute resets the verification. The default configuration of the rule is case-sensitive.

The following patterns are considered warnings:

```js
var Component = Inferno.createClass({
  propTypes: {
    z: Inferno.PropTypes.number,
    a: Inferno.PropTypes.any,
    b: Inferno.PropTypes.string
  },
...
});

class Component extends Inferno.Component {
  ...
}
Component.propTypes = {
  z: Inferno.PropTypes.number,
  a: Inferno.PropTypes.any,
  b: Inferno.PropTypes.string
};

class Component extends Inferno.Component {
  static propTypes = {
    z: Inferno.PropTypes.any,
    y: Inferno.PropTypes.any,
    a: Inferno.PropTypes.any
  }
  render() {
    return <div />;
  }
}
```

The following patterns are considered okay and do not cause warnings:

```js
var Component = Inferno.createClass({
  propTypes: {
    a: Inferno.PropTypes.number,
    b: Inferno.PropTypes.any,
    c: Inferno.PropTypes.string
  },
...
});

class Component extends Inferno.Component {
  ...
}
Component.propTypes = {
  a: Inferno.PropTypes.string,
  b: Inferno.PropTypes.any,
  c: Inferno.PropTypes.string
};

class Component extends Inferno.Component {
  static propTypes = {
    a: Inferno.PropTypes.any,
    b: Inferno.PropTypes.any,
    c: Inferno.PropTypes.any
  }
  render() {
    return <div />;
  }
}
```

## Rule Options

```js
...
"sort-prop-types": [<enabled>, {
  "callbacksLast": <boolean>,
  "ignoreCase": <boolean>,
  "requiredFirst": <boolean>,
}]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the declarations order.

### `callbacksLast`

When `true`, propTypes for props beginning with "on" must be listed after all other props:

```js
var Component = Inferno.createClass({
  propTypes: {
    a: Inferno.PropTypes.number,
    z: Inferno.PropTypes.string,
    onBar: Inferno.PropTypes.func,
    onFoo: Inferno.PropTypes.func,
  },
...
});
```

### `requiredFirst`

When `true`, prop types for required props must be listed before all other props:

```js
var Component = Inferno.createClass({
  propTypes: {
    barRequired: Inferno.PropTypes.any.isRequired,
    fooRequired: Inferno.PropTypes.any.isRequired,
    a: Inferno.PropTypes.number,
    z: Inferno.PropTypes.string,
  },
...
});
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing props declarations isn't a part of your coding standards, then you can leave this rule off.
