# Disallow passing of children as props (inferno/no-children-prop)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`, `recommended`.

Children should always be actual children, not passed in as a prop.

When using JSX, the children should be nested between the opening and closing
tags. When not using JSX, the children should be passed as additional
arguments to `Inferno.createElement`.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div children='Children' />

<MyComponent children={<AnotherComponent />} />
<MyComponent children={['Child 1', 'Child 2']} />

Inferno.createElement("div", { children: 'Children' })
```

Examples of **correct** code for this rule:

```jsx
<div>Children</div>

<MyComponent>Children</MyComponent>

<MyComponent>
  <span>Child 1</span>
  <span>Child 2</span>
</MyComponent>

Inferno.createElement("div", {}, 'Children')
Inferno.createElement("div", 'Child 1', 'Child 2')
```

## Rule Options

```js
"inferno/no-children-prop": [<enabled>, {
  "allowFunctions": <boolean> || false
}]
```

### `allowFunctions`

When `true`, and passing a function as `children`, it must be in prop position and not child position.

The following patterns are considered warnings:

```jsx
<MyComponent>{data => data.value}</MyComponent>
Inferno.createElement(MyComponent, {}, data => data.value)
```

The following are **not** considered warnings:

```jsx
<MyComponent children={data => data.value} />
Inferno.createElement(MyComponent, { children: data => data.value })
```
