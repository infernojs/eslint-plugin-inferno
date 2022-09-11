# Disallow when a DOM element is using both children and dangerouslySetInnerHTML (inferno/no-danger-with-children)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`, `recommended`.

This rule helps prevent problems caused by using children and the dangerouslySetInnerHTML prop at the same time.
Inferno will throw a warning if this rule is ignored.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div dangerouslySetInnerHTML={{ __html: "HTML" }}>
  Children
</div>

<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
  Children
</Hello>

```

```js
Inferno.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } }, "Children");

Inferno.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } }, "Children");
```

Examples of **correct** code for this rule:

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
Inferno.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });

Inferno.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });

Inferno.createElement("div", {}, "Children");

Inferno.createElement("Hello", {}, "Children");
```
