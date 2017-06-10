# Prevent problem with children and props.dangerouslySetInnerHTML (inferno/no-danger-with-children)

This rule helps prevent problems caused by using children and the dangerouslySetInnerHTML prop at the same time.
Inferno will throw a warning if this rule is ignored.

## Rule Details

The following patterns are considered warnings:

```jsx
<div dangerouslySetInnerHTML={{ __html: "HTML" }}>
  Children
</div>

<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
  Children
</Hello>

```

```js
Inferno.createVNode(2, "div", { dangerouslySetInnerHTML: { __html: "HTML" } }, "Children");

Inferno.createVNode(2, "Hello", { dangerouslySetInnerHTML: { __html: "HTML" } }, "Children");
```

The following patterns are not considered warnings:

```jsx
<div dangerouslySetInnerHTML={{ __html: "HTML" }} />

<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />

<div>
  Children
</div>

<Hello>
  Children
</Hello>

```

```js
Inferno.createVNode(2, "div", { dangerouslySetInnerHTML: { __html: "HTML" } });

Inferno.createVNode(2, "Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });

Inferno.createVNode(2, "div", {}, "Children");

Inferno.createVNode(2, "Hello", {}, "Children");
```

