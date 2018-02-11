# Prevents common typos (inferno/no-typos)

Ensure no casing typos were made declaring static class properties and lifecycle methods.

## Rule Details

This rule checks whether the declared static class properties and lifecycle methods related to Inferno components do not contain any typos.

It makes sure that the following class properties have
no casing typos:

* defaultProps

and the following inferno lifecycle methods:

* componentWillMount
* componentDidMount
* componentWillReceiveProps
* shouldComponentUpdate
* componentWillUpdate
* componentDidUpdate
* componentWillUnmount
* render


The following patterns are considered warnings:

```js
class MyComponent extends Inferno.Component {
  static PropTypes = {}
}

class MyComponent extends Inferno.Component {
  static proptypes = {}
}

class MyComponent extends Inferno.Component {
  static ContextTypes = {}
}

class MyComponent extends Inferno.Component {
  static contexttypes = {}
}

class MyComponent extends Inferno.Component {
  static ChildContextTypes = {}
}

class MyComponent extends Inferno.Component {
  static childcontexttypes = {}
}

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
  static propTypes = {
    a: PropTypes.typo
  }
}

```

The following patterns are **not** considered warnings:

```js
class MyComponent extends Inferno.Component {
  static propTypes = {}
}

class MyComponent extends Inferno.Component {
  static contextTypes = {}
}

class MyComponent extends Inferno.Component {
  static childContextTypes = {}
}

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

class MyComponent extends Inferno.Component {
  static propTypes = {
    a: PropTypes.bool.isRequired
  }
}
```
