# Prevent usage of the return value of Inferno.render (no-render-return-value)

> `Inferno.render()` currently returns a reference to the root `InfernoComponent` instance. However, using this return value is legacy and should be avoided because future versions of Inferno may render components asynchronously in some cases. If you need a reference to the root `InfernoComponent` instance, the preferred solution is to attach a [callback ref](http://facebook.github.io/inferno/docs/more-about-refs.html#the-ref-callback-attribute) to the root element.

Source: [Inferno Top-Level API documentation](http://facebook.github.io/inferno/docs/top-level-api.html#infernodom.render)

## Rule Details

This rule will warn you if you try to use the `Inferno.render()` return value.

The following pattern is considered a warning:

```js
const inst = Inferno.render(<App />, document.body);
doSomethingWithInst(inst);
```

The following patterns are not considered warnings:

```js
Inferno.render(<App ref={doSomethingWithInst} />, document.body);

Inferno.render(<App />, document.body, doSomethingWithInst);
```
