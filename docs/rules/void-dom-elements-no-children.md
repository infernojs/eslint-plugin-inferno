# Prevent void DOM elements (e.g. `<img />`, `<br />`) from receiving children (inferno/void-dom-elements-no-children)

There are some HTML elements that are only self-closing (e.g. `img`, `br`, `hr`). These are collectively known as void DOM elements. If you try to give these children, Inferno will give you a warning like:

> Invariant Violation: img is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.


## Rule Details

The following patterns are considered warnings:

```jsx
<br>Children</br>
<br children='Children' />
<br dangerouslySetInnerHTML={{ __html: 'HTML' }} />
Inferno.createElement('br', undefined, 'Children')
Inferno.createElement('br', { children: 'Children' })
Inferno.createElement('br', { dangerouslySetInnerHTML: { __html: 'HTML' } })
```

The following patterns are not considered warnings:

```jsx
<div>Children</div>
<div children='Children' />
<div dangerouslySetInnerHTML={{ __html: 'HTML' }} />
Inferno.createElement('div', undefined, 'Children')
Inferno.createElement('div', { children: 'Children' })
Inferno.createElement('div', { dangerouslySetInnerHTML: { __html: 'HTML' } })
```
