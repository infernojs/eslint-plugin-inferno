# Prevent adjacent inline elements not separated by whitespace. (inferno/no-adjacent-inline-elements)

Adjacent inline elements not separated by whitespace will bump up against each
other when viewed in an unstyled manner, which usually isn't desirable.

## Rule Details

The following patterns are considered warnings:

```jsx
<div><a></a><a></a></div>
<div><a></a><span></span></div>

Inferno.createElement("div", undefined, [Inferno.createElement("a"), Inferno.createElement("span")]);
```

The following patterns are not considered warnings:

```jsx
<div><div></div><div></div></div>
<div><a></a> <a></a></div>

Inferno.createElement("div", undefined, [Inferno.createElement("a"), " ", Inferno.createElement("a")]);
```
