# inferno/style-prop-object

📝 Enforce style prop value is an object.

<!-- end auto-generated rule header -->

Require that the value of the prop `style` be an object or a variable that is
an object.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<div style="color: 'red'" />

<div style={true} />

<Hello style={true} />

const styles = true;
<div style={styles} />
```

```js
Inferno.createElement("div", { style: "color: 'red'" });

Inferno.createElement("div", { style: true });

Inferno.createElement("Hello", { style: true });

const styles = true;
Inferno.createElement("div", { style: styles });
```

Examples of **correct** code for this rule:

```jsx
<div style={{ color: "red" }} />

<Hello style={{ color: "red" }} />

const styles = { color: "red" };
<div style={styles} />
```

```js
Inferno.createElement("div", { style: { color: 'red' }});

Inferno.createElement("Hello", { style: { color: 'red' }});

const styles = { height: '100px' };
Inferno.createElement("div", { style: styles });
```

## Rule Options

```js
...
"inferno/style-prop-object": [<enabled>, {
  "allow": [<string>]
}]
...
```

### `allow`

A list of elements that are allowed to have a non-object value in their style attribute. The default value is `[]`.

#### Example

```js
{
  "allow": ["MyComponent"]
}
```

Examples of **incorrect** code for this rule:

```js
<Hello style="a string">
Inferno.createElement(Hello, { style: "some styling" });
```

Examples of **correct** code for this rule:

```js
<MyComponent style="a string">
Inferno.createElement(MyComponent, { style: "some styling" });
```
