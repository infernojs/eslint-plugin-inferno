# Prevents common typos (inferno/no-typos)

Ensure no casing typos were made declaring static class properties and lifecycle methods.

## Rule Details

This rule checks whether the declared static class properties and lifecycle methods related to Inferno components do not contain any typos.

It makes sure that the following class properties have
no casing typos:

* defaultProps

and the following inferno lifecycle methods:

* getDerivedStateFromProps
* componentWillMount
* componentDidMount
* componentWillReceiveProps
* shouldComponentUpdate
* componentWillUpdate
* getSnapshotBeforeUpdate
* componentDidUpdate
* componentDidCatch
* componentWillUnmount
* render


Examples of **incorrect** code for this rule:

```js
class MyComponent extends Inferno.Component {
  static DefaultProps = {}
}

class MyComponent extends Inferno.Component {
  static defaultprops = {}
}

class MyComponent extends Inferno.Component {
  componentwillMount() {}
}

class MyComponent extends Inferno.Component {
  ComponentWillReceiveProps() {}
}

class MyComponent extends Inferno.Component {
  componentdidupdate() {}
}

class MyComponent extends Inferno.Component {
  getDerivedStateFromProps() {}
}
```

Examples of **correct** code for this rule:

```js
class MyComponent extends Inferno.Component {
  static defaultProps = {}
}

class MyComponent extends Inferno.Component {
  componentWillMount() {}
}

class MyComponent extends Inferno.Component {
  componentWillReceiveProps() {}
}

class MyComponent extends Inferno.Component {
  componentDidUpdate() {}
}
```
