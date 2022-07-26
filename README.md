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
| ✔ | 🔧 | Rule | Description |
| :---: | :---: | :--- | :--- |
|  |  | [inferno/button-has-type](docs/rules/button-has-type.md) | Forbid "button" element without an explicit "type" attribute |
|  | 🔧 | [inferno/destructuring-assignment](docs/rules/destructuring-assignment.md) | Enforce consistent usage of destructuring assignment of props, state, and context |
|  |  | [inferno/forbid-component-props](docs/rules/forbid-component-props.md) | Forbid certain props on components |
|  |  | [inferno/forbid-dom-props](docs/rules/forbid-dom-props.md) | Forbid certain props on DOM Nodes |
|  |  | [inferno/forbid-elements](docs/rules/forbid-elements.md) | Forbid certain elements |
|  | 🔧 | [inferno/function-component-definition](docs/rules/function-component-definition.md) | Standardize the way function component get defined |
|  |  | [inferno/iframe-missing-sandbox](docs/rules/iframe-missing-sandbox.md) | Enforce sandbox attribute on iframe elements |
|  |  | [inferno/inferno-in-jsx-scope](docs/rules/inferno-in-jsx-scope.md) | Prevent missing Inferno when using JSX |
|  |  | [inferno/no-access-state-in-setstate](docs/rules/no-access-state-in-setstate.md) | Reports when this.state is accessed within setState |
|  |  | [inferno/no-adjacent-inline-elements](docs/rules/no-adjacent-inline-elements.md) | Prevent adjacent inline elements not separated by whitespace. |
|  |  | [inferno/no-array-index-key](docs/rules/no-array-index-key.md) | Prevent usage of Array index in keys |
|  | 🔧 | [inferno/no-arrow-function-lifecycle](docs/rules/no-arrow-function-lifecycle.md) | Lifecycle methods should be methods on the prototype, not class fields |
| ✔ |  | [inferno/no-children-prop](docs/rules/no-children-prop.md) | Prevent passing of children as props. |
|  |  | [inferno/no-danger](docs/rules/no-danger.md) | Prevent usage of dangerous JSX props |
| ✔ |  | [inferno/no-danger-with-children](docs/rules/no-danger-with-children.md) | Report when a DOM element is using both children and dangerouslySetInnerHTML |
|  |  | [inferno/no-did-mount-set-state](docs/rules/no-did-mount-set-state.md) | Prevent usage of setState in componentDidMount |
|  |  | [inferno/no-did-update-set-state](docs/rules/no-did-update-set-state.md) | Prevent usage of setState in componentDidUpdate |
| ✔ |  | [inferno/no-direct-mutation-state](docs/rules/no-direct-mutation-state.md) | Prevent direct mutation of this.state |
| ✔ |  | [inferno/no-find-dom-node](docs/rules/no-find-dom-node.md) | Prevent usage of findDOMNode |
|  | 🔧 | [inferno/no-invalid-html-attribute](docs/rules/no-invalid-html-attribute.md) | Forbid attribute with an invalid values` |
| ✔ |  | [inferno/no-is-mounted](docs/rules/no-is-mounted.md) | Prevent usage of isMounted |
|  |  | [inferno/no-multi-comp](docs/rules/no-multi-comp.md) | Prevent multiple component definition per file |
|  |  | [inferno/no-namespace](docs/rules/no-namespace.md) | Enforce that namespaces are not used in Inferno elements |
|  |  | [inferno/no-redundant-should-component-update](docs/rules/no-redundant-should-component-update.md) | Flag shouldComponentUpdate when extending PureComponent |
| ✔ |  | [inferno/no-render-return-value](docs/rules/no-render-return-value.md) | Prevent usage of the return value of Inferno.render |
|  |  | [inferno/no-set-state](docs/rules/no-set-state.md) | Prevent usage of setState |
| ✔ |  | [inferno/no-string-refs](docs/rules/no-string-refs.md) | Prevent string definitions for references and prevent referencing this.refs |
|  |  | [inferno/no-this-in-sfc](docs/rules/no-this-in-sfc.md) | Report "this" being used in stateless components |
|  |  | [inferno/no-typos](docs/rules/no-typos.md) | Prevent common typos |
| ✔ |  | [inferno/no-unescaped-entities](docs/rules/no-unescaped-entities.md) | Detect unescaped HTML entities, which might represent malformed tags |
| ✔ | 🔧 | [inferno/no-unknown-property](docs/rules/no-unknown-property.md) | Prevent usage of unknown DOM property |
|  |  | [inferno/no-unstable-nested-components](docs/rules/no-unstable-nested-components.md) | Prevent creating unstable components inside components |
|  |  | [inferno/no-unused-class-component-methods](docs/rules/no-unused-class-component-methods.md) | Prevent declaring unused methods of component class |
|  |  | [inferno/no-unused-state](docs/rules/no-unused-state.md) | Prevent definition of unused state fields |
|  |  | [inferno/no-will-update-set-state](docs/rules/no-will-update-set-state.md) | Prevent usage of setState in componentWillUpdate |
|  |  | [inferno/prefer-es6-class](docs/rules/prefer-es6-class.md) | Enforce ES5 or ES6 class for Inferno Components |
|  |  | [inferno/prefer-stateless-function](docs/rules/prefer-stateless-function.md) | Enforce stateless components to be written as a pure function |
|  |  | [inferno/require-optimization](docs/rules/require-optimization.md) | Enforce Inferno components to have a shouldComponentUpdate method |
| ✔ |  | [inferno/require-render-return](docs/rules/require-render-return.md) | Enforce ES5 or ES6 class for returning value in render function |
|  | 🔧 | [inferno/self-closing-comp](docs/rules/self-closing-comp.md) | Prevent extra closing tags for components without children |
|  |  | [inferno/sort-comp](docs/rules/sort-comp.md) | Enforce component methods order |
|  |  | [inferno/state-in-constructor](docs/rules/state-in-constructor.md) | State initialization in an ES6 class component should be in a constructor |
|  |  | [inferno/static-property-placement](docs/rules/static-property-placement.md) | Defines where Inferno component static properties should be positioned. |
|  |  | [inferno/style-prop-object](docs/rules/style-prop-object.md) | Enforce style prop value is an object |
|  |  | [inferno/void-dom-elements-no-children](docs/rules/void-dom-elements-no-children.md) | Prevent passing of children to void DOM elements (e.g. `<br />`). |
<!-- AUTO-GENERATED-CONTENT:END -->

## JSX-specific rules

<!-- AUTO-GENERATED-CONTENT:START (JSX_RULES) -->
| ✔ | 🔧 | Rule | Description |
| :---: | :---: | :--- | :--- |
|  | 🔧 | [inferno/jsx-boolean-value](docs/rules/jsx-boolean-value.md) | Enforce boolean attributes notation in JSX |
|  |  | [inferno/jsx-child-element-spacing](docs/rules/jsx-child-element-spacing.md) | Ensures inline tags are not rendered without spaces between them |
|  | 🔧 | [inferno/jsx-closing-bracket-location](docs/rules/jsx-closing-bracket-location.md) | Validate closing bracket location in JSX |
|  | 🔧 | [inferno/jsx-closing-tag-location](docs/rules/jsx-closing-tag-location.md) | Validate closing tag location for multiline JSX |
|  | 🔧 | [inferno/jsx-curly-brace-presence](docs/rules/jsx-curly-brace-presence.md) | Disallow unnecessary JSX expressions when literals alone are sufficient or enfore JSX expressions on literals in JSX children or attributes |
|  | 🔧 | [inferno/jsx-curly-newline](docs/rules/jsx-curly-newline.md) | Enforce consistent line breaks inside jsx curly |
|  | 🔧 | [inferno/jsx-curly-spacing](docs/rules/jsx-curly-spacing.md) | Enforce or disallow spaces inside of curly braces in JSX attributes |
|  | 🔧 | [inferno/jsx-equals-spacing](docs/rules/jsx-equals-spacing.md) | Disallow or enforce spaces around equal signs in JSX attributes |
|  |  | [inferno/jsx-filename-extension](docs/rules/jsx-filename-extension.md) | Restrict file extensions that may contain JSX |
|  | 🔧 | [inferno/jsx-first-prop-new-line](docs/rules/jsx-first-prop-new-line.md) | Ensure proper position of the first property in JSX |
|  | 🔧 | [inferno/jsx-fragments](docs/rules/jsx-fragments.md) | Enforce shorthand or standard form for Inferno fragments |
|  |  | [inferno/jsx-handler-names](docs/rules/jsx-handler-names.md) | Enforce event handler naming conventions in JSX |
|  | 🔧 | [inferno/jsx-indent](docs/rules/jsx-indent.md) | Validate JSX indentation |
|  | 🔧 | [inferno/jsx-indent-props](docs/rules/jsx-indent-props.md) | Validate props indentation in JSX |
| ✔ |  | [inferno/jsx-key](docs/rules/jsx-key.md) | Report missing `key` props in iterators/collection literals |
|  |  | [inferno/jsx-max-depth](docs/rules/jsx-max-depth.md) | Validate JSX maximum depth |
|  | 🔧 | [inferno/jsx-max-props-per-line](docs/rules/jsx-max-props-per-line.md) | Limit maximum of props on a single line in JSX |
|  | 🔧 | [inferno/jsx-newline](docs/rules/jsx-newline.md) | Require or prevent a new line after jsx elements and expressions. |
|  |  | [inferno/jsx-no-bind](docs/rules/jsx-no-bind.md) | Prevents usage of Function.prototype.bind and arrow functions in Inferno component props |
| ✔ |  | [inferno/jsx-no-comment-textnodes](docs/rules/jsx-no-comment-textnodes.md) | Comments inside children section of tag should be placed inside braces |
|  |  | [inferno/jsx-no-constructed-context-values](docs/rules/jsx-no-constructed-context-values.md) | Prevents JSX context provider values from taking values that will cause needless rerenders. |
| ✔ |  | [inferno/jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md) | Enforce no duplicate props |
|  | 🔧 | [inferno/jsx-no-leaked-render](docs/rules/jsx-no-leaked-render.md) | Prevent problematic leaked values from being rendered |
|  |  | [inferno/jsx-no-literals](docs/rules/jsx-no-literals.md) | Prevent using string literals in Inferno component definition |
|  |  | [inferno/jsx-no-script-url](docs/rules/jsx-no-script-url.md) | Forbid `javascript:` URLs |
| ✔ | 🔧 | [inferno/jsx-no-target-blank](docs/rules/jsx-no-target-blank.md) | Forbid `target="_blank"` attribute without `rel="noreferrer"` |
| ✔ |  | [inferno/jsx-no-undef](docs/rules/jsx-no-undef.md) | Disallow undeclared variables in JSX |
|  | 🔧 | [inferno/jsx-no-useless-fragment](docs/rules/jsx-no-useless-fragment.md) | Disallow unnecessary fragments |
|  | 🔧 | [inferno/jsx-one-expression-per-line](docs/rules/jsx-one-expression-per-line.md) | Limit to one expression per line in JSX |
|  |  | [inferno/jsx-pascal-case](docs/rules/jsx-pascal-case.md) | Enforce PascalCase for user-defined JSX components |
|  | 🔧 | [inferno/jsx-props-class-name](docs/rules/jsx-props-class-name.md) | Enforce 'class' or 'className' attributes |
|  | 🔧 | [inferno/jsx-props-no-multi-spaces](docs/rules/jsx-props-no-multi-spaces.md) | Disallow multiple spaces between inline JSX props |
|  |  | [inferno/jsx-props-no-spreading](docs/rules/jsx-props-no-spreading.md) | Prevent JSX prop spreading |
|  |  | [inferno/jsx-sort-default-props](docs/rules/jsx-sort-default-props.md) | Enforce default props alphabetical sorting |
|  | 🔧 | [inferno/jsx-sort-props](docs/rules/jsx-sort-props.md) | Enforce props alphabetical sorting |
|  | 🔧 | [inferno/jsx-space-before-closing](docs/rules/jsx-space-before-closing.md) | Validate spacing before closing bracket in JSX |
|  | 🔧 | [inferno/jsx-tag-spacing](docs/rules/jsx-tag-spacing.md) | Validate whitespace in and around the JSX opening and closing brackets |
|  |  | [inferno/jsx-uses-inferno](docs/rules/jsx-uses-inferno.md) | Prevent Inferno to be marked as unused |
| ✔ |  | [inferno/jsx-uses-vars](docs/rules/jsx-uses-vars.md) | Prevent variables used in JSX to be marked as unused |
|  | 🔧 | [inferno/jsx-wrap-multilines](docs/rules/jsx-wrap-multilines.md) | Prevent missing parentheses around multilines JSX |
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
