`eslint-plugin-inferno`
===================

Note: This is a fork of the great [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react).

Inferno specific linting rules for ESLint. Linting logic has been optimized for InfernoJS library.
Some of the rules has been removed because they don't work in context of InfernoJS.
Please see [not supported rules] section.

This plugins support NodeJS v10+ and eslint v6+
Legacy versions of nodejs and eslint are not supported to reduce code complexity

# Installation

Install [`eslint`](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint@7 --save-dev
```

It is also possible to install ESLint globally rather than locally (using npm install eslint --global). However, this is not recommended, and any plugins or shareable configs that you use must be installed locally in either case.


# Configuration


Use [our preset](#recommended) to get reasonable defaults:

```json
  "extends": [
    "eslint:recommended",
    "plugin:inferno/recommended"
  ]
```

You should also specify settings that will be shared across all the plugin rules. ([More about eslint shared settings](https://eslint.org/docs/user-guide/configuring/configuration-files#adding-shared-settings))

```json5
{
  "settings": {
    "inferno": {
      "createClass": "createClass", // Regex for Component Factory to use,  default to "createClass"
      "pragma": "Inferno",  // Pragma to use, default to "Inferno"
      "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"},
        // for rules that check exact prop wrappers
        {"property": "forbidExtraProps", "exact": true}
    ],
    "componentWrapperFunctions": [
        // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
        "observer", // `property`
        {"property": "styled"}, // `object` is optional
        {"property": "observer", "object": "Mobx"},
        {"property": "observer", "object": "<pragma>"} // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    "formComponents": [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      "CustomForm",
      {"name": "Form", "formAttribute": "endpoint"}
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"}
    ]
  }
}
```

If you do not use a preset you will need to specify individual rules and add extra configuration.

Add "inferno" to the plugins section.

```json
{
  "plugins": [
    "inferno"
  ]
}
```

Enable JSX support.

With `eslint` 2+

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

Enable the rules that you would like to use.

```json
  "rules": {
    "inferno/jsx-uses-inferno": "error",
    "inferno/jsx-uses-vars": "error",
  }
```

# List of supported rules

## Inferno specific rules

* [inferno/jsx-props-class-name](docs/rules/jsx-props-class-name.md): Enforce 'class' or 'className' Attributes (fixable)

✔: Enabled in the [`recommended`](#recommended) configuration.\
🔧: Fixable with [`eslint --fix`](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems).

<!-- AUTO-GENERATED-CONTENT:START (BASIC_RULES) -->
| ✔ | 🔧 | 💡 | Rule | Description |
| :---: | :---: | :---: | :--- | :--- |
|  |  |  | Disallow usage of `button` elements without an explicit `type` attribute |
|  | 🔧 |  | Enforce consistent usage of destructuring assignment of props, state, and context |
|  |  |  | Disallow certain props on components |
|  |  |  | Disallow certain props on DOM Nodes |
|  |  |  | Disallow certain elements |
|  | 🔧 |  | Enforce a specific function type for function components |
|  |  |  | Enforce sandbox attribute on iframe elements |
|  |  |  | Disallow missing React when using JSX |
|  | 🔧 |  | Enforce boolean attributes notation in JSX |
|  |  |  | Enforce or disallow spaces inside of curly braces in JSX attributes and expressions |
|  | 🔧 |  | Enforce closing bracket location in JSX |
|  | 🔧 |  | Enforce closing tag location for multiline JSX |
|  | 🔧 |  | Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes |
|  | 🔧 |  | Enforce consistent linebreaks in curly braces in JSX attributes and expressions |
|  | 🔧 |  | Enforce or disallow spaces inside of curly braces in JSX attributes and expressions |
|  | 🔧 |  | Enforce or disallow spaces around equal signs in JSX attributes |
|  |  |  | Disallow file extensions that may contain JSX |
|  | 🔧 |  | Enforce proper position of the first property in JSX |
|  | 🔧 |  | Enforce shorthand or standard form for Inferno fragments |
|  |  |  | Enforce event handler naming conventions in JSX |
|  | 🔧 |  | Enforce JSX indentation |
|  | 🔧 |  | Enforce props indentation in JSX |
| ✔ |  |  | Disallow missing `key` props in iterators/collection literals |
|  |  |  | Enforce JSX maximum depth |
|  | 🔧 |  | Enforce maximum of props on a single line in JSX |
|  | 🔧 |  | Require or prevent a new line after jsx elements and expressions. |
|  |  |  | Disallow `.bind()` or arrow functions in JSX props |
| ✔ |  |  | Disallow comments from being inserted as text nodes |
|  |  |  | Disallows JSX context provider values from taking values that will cause needless rerenders |
| ✔ |  |  | Disallow duplicate properties in JSX |
|  | 🔧 |  | Disallow problematic leaked values from being rendered |
|  |  |  | Disallow usage of string literals in JSX |
|  |  |  | Disallow usage of `javascript:` URLs |
| ✔ | 🔧 |  | Disallow `target="_blank"` attribute without `rel="noreferrer"` |
| ✔ |  |  | Disallow undeclared variables in JSX |
|  | 🔧 |  | Disallow unnecessary fragments |
|  | 🔧 |  | Require one JSX element per line |
|  |  |  | Enforce PascalCase for user-defined JSX components |
|  | 🔧 |  | Enforce 'class' or 'className' attributes |
|  | 🔧 |  | Disallow multiple spaces between inline JSX props |
|  |  |  | Disallow JSX prop spreading |
|  |  |  | Enforce defaultProps declarations alphabetical sorting |
|  | 🔧 |  | Enforce props alphabetical sorting |
|  | 🔧 |  | Enforce spacing before closing bracket in JSX. ❌ This rule is deprecated. |
|  | 🔧 |  | Enforce whitespace in and around the JSX opening and closing brackets |
|  |  |  | Disallow React to be incorrectly marked as unused |
| ✔ |  |  | Disallow variables used in JSX to be incorrectly marked as unused |
|  | 🔧 |  | Disallow missing parentheses around multiline JSX |
|  |  |  | Disallow when this.state is accessed within setState |
|  |  |  | Disallow adjacent inline elements not separated by whitespace. |
|  |  |  | Disallow usage of Array index in keys |
|  | 🔧 |  | Lifecycle methods should be methods on the prototype, not class fields |
| ✔ |  |  | Disallow passing of children as props |
|  |  |  | Disallow usage of dangerous JSX properties |
| ✔ |  |  | Disallow when a DOM element is using both children and dangerouslySetInnerHTML |
|  |  |  | Disallow usage of setState in componentDidMount |
|  |  |  | Disallow usage of setState in componentDidUpdate |
| ✔ |  |  | Disallow direct mutation of this.state |
| ✔ |  |  | Disallow usage of findDOMNode |
|  | 🔧 |  | Disallow usage of invalid attributes |
| ✔ |  |  | Disallow usage of isMounted |
|  |  |  | Disallow multiple component definition per file |
|  |  |  | Enforce that namespaces are not used in Inferno elements |
|  |  |  | Disallow usage of shouldComponentUpdate when extending React.PureComponent |
| ✔ |  |  | Disallow usage of the return value of ReactDOM.render |
|  |  |  | Disallow usage of setState |
| ✔ |  |  | Disallow using string references |
|  |  |  | Disallow `this` from being used in stateless functional components |
|  |  |  | Disallow common typos |
| ✔ |  |  | Disallow unescaped HTML entities from appearing in markup |
| ✔ | 🔧 |  | Disallow usage of unknown DOM property |
|  |  |  | Disallow creating unstable components inside components |
|  |  |  | Disallow declaring unused methods of component class |
|  |  |  | Disallow definitions of unused state |
|  |  |  | Disallow usage of setState in componentWillUpdate |
|  |  |  | Enforce ES5 or ES6 class for Inferno Components |
|  |  |  | Enforce stateless components to be written as a pure function |
|  |  |  | Enforce Inferno components to have a shouldComponentUpdate method |
| ✔ |  |  | Enforce ES5 or ES6 class for returning value in render function |
|  | 🔧 |  | Disallow extra closing tags for components without children |
|  |  |  | Enforce component methods order |
|  |  |  | Enforce class component state initialization style |
|  |  |  | Enforces where React component static properties should be positioned. |
|  |  |  | Enforce style prop value is an object |
|  |  |  | Disallow void DOM elements (e.g. `<img />`, `<br />`) from receiving children |
<!-- AUTO-GENERATED-CONTENT:END -->

## JSX-specific rules

<!-- AUTO-GENERATED-CONTENT:START (JSX_RULES) -->
| ✔ | 🔧 | 💡 | Rule | Description |
| :---: | :---: | :---: | :--- | :--- |
<!-- AUTO-GENERATED-CONTENT:END -->

## List of not supported rules
These rules have been removed because they don't make sense in context of InfernoJS.
InfernoJS does not have prop-types or UNSAFE_ -lifecycle methods.

* react/boolean-prop-naming
* react/default-props-match-prop-types
* react/display-name
* react/forbid-foreign-prop-types
* react/forbid-prop-types
* react/no-deprecated
* react/no-unsafe
* react/no-unused-prop-types
* react/prop-types
* react/sort-prop-types
* react/require-default-props
* react/prefer-read-only-props
* react/style-prop-object
* react/hook-use-state
* react/prefer-read-only-props
* react/prefer-exact-props

## Other useful plugins

- JSX accessibility: [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)

# Shareable configurations

## Recommended

This plugin exports a `recommended` configuration that enforces Inferno good practices.

To enable this configuration use the `extends` property in your `.eslintrc` config file:

```json
{
  "extends": ["eslint:recommended", "plugin:inferno/recommended"]
}
```

See [`eslint` documentation](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files) for more information about extending configuration files.

## All

This plugin also exports an `all` configuration that includes every available rule.
This pairs well with the `eslint:all` rule.

```json
{
  "plugins": [
    "inferno"
  ],
  "extends": ["eslint:all", "plugin:inferno/all"]
}
```

**Note**: These configurations will import `eslint-plugin-inferno` and enable JSX in [parser options](https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser-options).

# License

`eslint-plugin-inferno` is licensed under the [MIT License](https://opensource.org/licenses/mit-license.php).


[npm-url]: https://npmjs.org/package/eslint-plugin-inferno
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-inferno.svg
