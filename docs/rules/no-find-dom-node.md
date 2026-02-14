# inferno/no-find-dom-node

📝 Disallow usage of findDOMNode.

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/infernojs/eslint-plugin-inferno/#shareable-configs).

<!-- end auto-generated rule header -->

Facebook will eventually deprecate `findDOMNode` as it blocks certain improvements in Inferno in the future.

It is recommended to use callback refs instead.

## Rule Details

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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
