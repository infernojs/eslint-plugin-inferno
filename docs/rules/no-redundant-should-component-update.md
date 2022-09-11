# Disallow usage of shouldComponentUpdate when extending Inferno.PureComponent (inferno/no-redundant-should-component-update)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

Warns if you have `shouldComponentUpdate` defined when defining a component that extends Inferno.PureComponent.
While having `shouldComponentUpdate` will still work, it becomes pointless to extend PureComponent.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
class Foo extends Inferno.PureComponent {
  shouldComponentUpdate() {
    // do check
  }

  render() {
    return <div>Radical!</div>
  }
}

function Bar() {
  return class Baz extends Inferno.PureComponent {
    shouldComponentUpdate() {
      // do check
    }

    render() {
      return <div>Groovy!</div>
    }
  }
}
```

Examples of **correct** code for this rule:

```jsx
class Foo extends Inferno.Component {
  shouldComponentUpdate() {
    // do check
  }

  render() {
    return <div>Radical!</div>
  }
}

function Bar() {
  return class Baz extends Inferno.Component {
    shouldComponentUpdate() {
      // do check
    }

    render() {
      return <div>Groovy!</div>
    }
  }
}

class Qux extends Inferno.PureComponent {
  render() {
    return <div>Tubular!</div>
  }
}
```
