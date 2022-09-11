# Disallow adjacent inline elements not separated by whitespace. (inferno/no-adjacent-inline-elements)

💼 This rule is enabled in the following [configs](https://github.com/infernojs/eslint-plugin-inferno#shareable-configurations): `all`.

Adjacent inline elements not separated by whitespace will bump up against each
other when viewed in an unstyled manner, which usually isn't desirable.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div><a></a><a></a></div>
<div><a></a><span></span></div>

Inferno.createElement("div", undefined, [Inferno.createElement("a"), Inferno.createElement("span")]);
```

Examples of **correct** code for this rule:

```jsx
<div><div></div><div></div></div>
<div><a></a> <a></a></div>

Inferno.createElement("div", undefined, [Inferno.createElement("a"), " ", Inferno.createElement("a")]);
```
