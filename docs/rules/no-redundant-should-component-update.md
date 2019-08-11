# Prevent usage of shouldComponentUpdate when extending Inferno.PureComponent (inferno/no-redundant-should-component-update)

Warns if you have `shouldComponentUpdate` defined when defining a component that extends Inferno.PureComponent.
While having `shouldComponentUpdate` will still work, it becomes pointless to extend PureComponent.

## Rule Details

The following patterns are considered warnings:

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

The following patterns are **not** considered warnings:

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
