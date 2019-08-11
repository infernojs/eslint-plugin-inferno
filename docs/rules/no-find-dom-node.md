# Prevent usage of findDOMNode (inferno/no-find-dom-node)

Facebook will eventually deprecate `findDOMNode` as it blocks certain improvements in Inferno in the future.

It is recommended to use callback refs instead.

## Rule Details

The following patterns are considered warnings:

```jsx
class MyComponent extends Component {
  componentDidMount() {
    findDOMNode(this).scrollIntoView();
  }
  render() {
    return <div />
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class MyComponent extends Component {
  componentDidMount() {
    this.node.scrollIntoView();
  }
  render() {
    return <div ref={node => this.node = node} />
  }
}
```
