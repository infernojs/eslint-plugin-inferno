# Enforce using `onChange` or `readonly` attribute when `checked` is used (`inferno/checked-requires-onchange-or-readonly`)

<!-- end auto-generated rule header -->

This rule enforces `onChange` or `readonly` attribute for `checked` property of input elements.

It also warns when `checked` and `defaultChecked` properties are used together.

## Rule Details

Example of **incorrect** code for this rule:

```jsx
<input type="checkbox" checked />
<input type="checkbox" checked defaultChecked />
<input type="radio" checked defaultChecked />

Inferno.createElement('input', { checked: false });
Inferno.createElement('input', { type: 'checkbox', checked: true });
Inferno.createElement('input', { type: 'checkbox', checked: true, defaultChecked: true });
```

Example of **correct** code for this rule:

```jsx
<input type="checkbox" checked onChange={() => {}} />
<input type="checkbox" checked readOnly />
<input type="checkbox" checked onChange readOnly />
<input type="checkbox" defaultChecked />

Inferno.createElement('input', { type: 'checkbox', checked: true, onChange() {} });
Inferno.createElement('input', { type: 'checkbox', checked: true, readOnly: true });
Inferno.createElement('input', { type: 'checkbox', checked: true, onChange() {}, readOnly: true });
Inferno.createElement('input', { type: 'checkbox', defaultChecked: true });
```

## Rule Options

```js
"inferno/checked-requires-onchange-or-readonly": [<enabled>, {
  "ignoreMissingProperties": <boolean>,
  "ignoreExclusiveCheckedAttribute": <boolean>
}]
```
