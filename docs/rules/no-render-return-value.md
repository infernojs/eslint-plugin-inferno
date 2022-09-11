# Disallow usage of the return value of Inferno.render (inferno/no-render-return-value)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`, `recommended`.

> `Inferno.render()` (inferno-compat) currently returns a reference to the root `InfernoComponent` instance. However, using this return value is legacy and should be avoided because future versions of Inferno may render components asynchronously in some cases. If you need a reference to the root `InfernoComponent` instance, the preferred solution is to attach a callback ref or createRef() to the root element.

## Rule Details

This rule will warn you if you try to use the `Inferno.render()` return value.

Examples of **incorrect** code for this rule:

```jsx
const inst = Inferno.render(<App />, document.body);
doSomethingWithInst(inst);
```

Examples of **correct** code for this rule:

```jsx
Inferno.render(<App ref={doSomethingWithInst} />, document.body);

Inferno.render(<App />, document.body, doSomethingWithInst);
```
