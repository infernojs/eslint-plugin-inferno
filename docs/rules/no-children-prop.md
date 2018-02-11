# Prevent passing of children as props (inferno/no-children-prop)

Children should always be actual children, not passed in as a prop.

When using JSX, the children should be nested between the opening and closing
tags. When not using JSX, the children should be passed as additional
arguments to `Inferno.createVNode`.

## Rule Details

The following patterns are considered warnings:

```jsx
<div children='Children' />

<MyComponent children={<AnotherComponent />} />
<MyComponent children={['Child 1', 'Child 2']} />

Inferno.createVNode(2, "div", { children: 'Children' })
```

The following patterns are **not** considered warnings:

```jsx
<div>Children</div>

<MyComponent>Children</MyComponent>

<MyComponent>
  <span>Child 1</span>
  <span>Child 2</span>
</MyComponent>

Inferno.createVNode(2, "div", {}, 'Children')
Inferno.createVNode(2, "div", null, ['Child 1', 'Child 2'])
```
