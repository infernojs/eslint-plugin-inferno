# inferno/jsx-no-comment-textnodes

📝 Disallow comments from being inserted as text nodes.

💼 This rule is enabled in the ☑️ `recommended` [config](https://github.com/infernojs/eslint-plugin-inferno/#shareable-configs).

<!-- end auto-generated rule header -->

This rule prevents comment strings (e.g. beginning with `//` or `/*`) from being accidentally
injected as a text node in JSX statements.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createClass({
  render: function() {
    return (
      <div>// empty div</div>
    );
  }
});

var Hello = createClass({
  render: function() {
    return (
      <div>
        /* empty div */
      </div>
    );
  }
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = createClass({
  displayName: 'Hello',
  render: function() {
    return <div>{/* empty div */}</div>;
  }
});

var Hello = createClass({
  displayName: 'Hello',
  render: function() {
    return <div /* empty div */></div>;
  }
});

var Hello = createClass({
  displayName: 'Hello',
  render: function() {
    return <div className={'foo' /* temp class */}</div>;
  }
});
```

## Legitimate uses

It's possible you may want to legitimately output comment start characters (`//` or `/*`) in a JSX text node. In which case, you can do the following:

```jsx
var Hello = createClass({
  render: function() {
    return (
      <div>{'/* This will be output as a text node */'}</div>
    );
  }
});
```
