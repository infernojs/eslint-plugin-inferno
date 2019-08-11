# Enforce Inferno components to have a shouldComponentUpdate method (inferno/require-optimization)

This rule prevents you from creating Inferno components without declaring a `shouldComponentUpdate` method.

## Rule Details

The following patterns are considered warnings:

```js
class YourComponent extends Inferno.Component {

}
```

```js
createClass({
});
```

The following patterns are **not** considered warnings:

```js
class YourComponent extends Inferno.Component {
	shouldComponentUpdate () {
		return false;
	}
}
```

```js
createClass({
	shouldComponentUpdate: function () {
		return false;
	}
});
```

```js
createClass({
	mixins: [PureRenderMixin]
});
```

```js
@infernoMixin.decorate(PureRenderMixin)
createClass({

});
```

## Rule Options

```js
...
"inferno/require-optimization": [<enabled>, { allowDecorators: [<allowDecorator>] }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
* `allowDecorators`: optional array of decorators names to allow validation.


### `allowDecorators`

Sets the allowed names of decorators. If the variable is present in the chain of decorators, it validates

The following patterns are **not** warnings:

```js
// ['pureRender']
@pureRender
class Hello extends Inferno.Component {}
```

### Example

```js
...
"inferno/require-optimization": [2, {allowDecorators: ['customDecorators']}]
...
```
