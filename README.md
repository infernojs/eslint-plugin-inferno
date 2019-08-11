ESLint-plugin-Inferno
===================

Note: This is a fork of the great [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react).

Inferno specific linting rules for ESLint. Linting logic has been optimized for InfernoJS library.
Some of the rules has been removed because they don't work in context of InfernoJS.
Please see [not supported rules] section.

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install Inferno plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-inferno --save-dev
```

# Configuration

Use [our preset](#recommended) to get reasonable defaults:

```json
  "extends": [
    "eslint:recommended",
    "plugin:inferno/recommended"
  ]
```

You should also specify settings that will be shared across all the plugin rules. ([More about eslint shared settings](https://eslint.org/docs/user-guide/configuring#adding-shared-settings))

```json5
{
  "settings": {
    "inferno": {
      "createClass": "createClass", // Regex for Component Factory to use,  default to "createClass"
      "pragma": "Inferno"  // Pragma to use, default to "Inferno"
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"}
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

With ESLint 2+

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

## Common rules for Inferno and React

* [inferno/button-has-type](docs/rules/button-has-type.md): Forbid "button" element without an explicit "type" attribute
* [inferno/destructuring-assignment](docs/rules/destructuring-assignment.md): Rule enforces consistent usage of destructuring assignment in component
* [inferno/forbid-component-props](docs/rules/forbid-component-props.md): Forbid certain props on Components
* [inferno/forbid-dom-props](docs/rules/forbid-dom-props.md): Forbid certain props on DOM Nodes
* [inferno/forbid-elements](docs/rules/forbid-elements.md): Forbid certain elements
* [inferno/no-access-state-in-setstate](docs/rules/no-access-state-in-setstate.md): Prevent using this.state inside this.setState
* [inferno/no-array-index-key](docs/rules/no-array-index-key.md): Prevent using Array index in `key` props
* [inferno/no-children-prop](docs/rules/no-children-prop.md): Prevent passing children as props
* [inferno/no-danger](docs/rules/no-danger.md): Prevent usage of dangerous JSX properties
* [inferno/no-danger-with-children](docs/rules/no-danger-with-children.md): Prevent problem with children and props.dangerouslySetInnerHTML
* [inferno/no-did-mount-set-state](docs/rules/no-did-mount-set-state.md): Prevent usage of `setState` in `componentDidMount`
* [inferno/no-did-update-set-state](docs/rules/no-did-update-set-state.md): Prevent usage of `setState` in `componentDidUpdate`
* [inferno/no-direct-mutation-state](docs/rules/no-direct-mutation-state.md): Prevent direct mutation of `this.state`
* [inferno/no-find-dom-node](docs/rules/no-find-dom-node.md): Prevent usage of `findDOMNode`
* [inferno/no-is-mounted](docs/rules/no-is-mounted.md): Prevent usage of `isMounted`
* [inferno/no-multi-comp](docs/rules/no-multi-comp.md): Prevent multiple component definition per file
* [inferno/no-redundant-should-component-update](docs/rules/no-redundant-should-component-update.md): Prevent usage of `shouldComponentUpdate` when extending Inferno.PureComponent
* [inferno/no-render-return-value](docs/rules/no-render-return-value.md): Prevent usage of the return value of `Inferno.render`
* [inferno/no-set-state](docs/rules/no-set-state.md): Prevent usage of `setState`
* [inferno/no-typos](docs/rules/no-typos.md): Prevent common casing typos
* [inferno/no-string-refs](docs/rules/no-string-refs.md): Prevent using string references in `ref` attribute.
* [inferno/no-this-in-sfc](docs/rules/no-this-in-sfc.md): Prevent using `this` in stateless functional components
* [inferno/no-unescaped-entities](docs/rules/no-unescaped-entities.md): Prevent invalid characters from appearing in markup
* [inferno/no-unknown-property](docs/rules/no-unknown-property.md): Prevent usage of unknown DOM property (fixable)
* [inferno/no-unused-state](docs/rules/no-unused-state.md): Prevent definitions of unused state properties
* [inferno/no-will-update-set-state](docs/rules/no-will-update-set-state.md): Prevent usage of `setState` in `componentWillUpdate`
* [inferno/prefer-es6-class](docs/rules/prefer-es6-class.md): Enforce ES5 or ES6 class for Inferno Components
* [inferno/prefer-stateless-function](docs/rules/prefer-stateless-function.md): Enforce stateless Inferno Components to be written as a pure function
* [inferno/inferno-in-jsx-scope](docs/rules/inferno-in-jsx-scope.md): Prevent missing `Inferno` when using JSX
* [inferno/require-optimization](docs/rules/require-optimization.md): Enforce Inferno components to have a `shouldComponentUpdate` method
* [inferno/require-render-return](docs/rules/require-render-return.md): Enforce ES5 or ES6 class for returning value in render function
* [inferno/self-closing-comp](docs/rules/self-closing-comp.md): Prevent extra closing tags for components without children (fixable)
* [inferno/sort-comp](docs/rules/sort-comp.md): Enforce component methods order (fixable)
* [inferno/state-in-constructor](docs/rules/state-in-constructor.md): Enforce the state initialization style to be either in a constructor or with a class property
* [inferno/static-property-placement](docs/rules/static-property-placement.md): Enforces where Inferno component static properties should be positioned.
* [inferno/style-prop-object](docs/rules/style-prop-object.md): Enforce style prop value being an object
* [inferno/void-dom-elements-no-children](docs/rules/void-dom-elements-no-children.md): Prevent void DOM elements (e.g. `<img />`, `<br />`) from receiving children

## JSX-specific rules

* [inferno/jsx-boolean-value](docs/rules/jsx-boolean-value.md): Enforce boolean attributes notation in JSX (fixable)
* [inferno/jsx-child-element-spacing](docs/rules/jsx-child-element-spacing.md): Enforce or disallow spaces inside of curly braces in JSX attributes and expressions.
* [inferno/jsx-closing-bracket-location](docs/rules/jsx-closing-bracket-location.md): Validate closing bracket location in JSX (fixable)
* [inferno/jsx-closing-tag-location](docs/rules/jsx-closing-tag-location.md): Validate closing tag location in JSX (fixable)
* [inferno/jsx-curly-newline](docs/rules/jsx-curly-newline.md): Enforce or disallow newlines inside of curly braces in JSX attributes and expressions (fixable)
* [inferno/jsx-curly-spacing](docs/rules/jsx-curly-spacing.md): Enforce or disallow spaces inside of curly braces in JSX attributes and expressions (fixable)
* [inferno/jsx-equals-spacing](docs/rules/jsx-equals-spacing.md): Enforce or disallow spaces around equal signs in JSX attributes (fixable)
* [inferno/jsx-filename-extension](docs/rules/jsx-filename-extension.md): Restrict file extensions that may contain JSX
* [inferno/jsx-first-prop-new-line](docs/rules/jsx-first-prop-new-line.md): Enforce position of the first prop in JSX (fixable)
* [inferno/jsx-handler-names](docs/rules/jsx-handler-names.md): Enforce event handler naming conventions in JSX
* [inferno/jsx-indent](docs/rules/jsx-indent.md): Validate JSX indentation (fixable)
* [inferno/jsx-indent-props](docs/rules/jsx-indent-props.md): Validate props indentation in JSX (fixable)
* [inferno/jsx-key](docs/rules/jsx-key.md): Validate JSX has key prop when in array or iterator
* [inferno/jsx-max-depth](docs/rules/jsx-max-depth.md): Validate JSX maximum depth
* [inferno/jsx-max-props-per-line](docs/rules/jsx-max-props-per-line.md): Limit maximum of props on a single line in JSX (fixable)
* [inferno/jsx-no-bind](docs/rules/jsx-no-bind.md): Prevent usage of `.bind()` and arrow functions in JSX props
* [inferno/jsx-no-comment-textnodes](docs/rules/jsx-no-comment-textnodes.md): Prevent comments from being inserted as text nodes
* [inferno/jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md): Prevent duplicate props in JSX
* [inferno/jsx-no-literals](docs/rules/jsx-no-literals.md): Prevent usage of unwrapped JSX strings
* [inferno/jsx-no-target-blank](docs/rules/jsx-no-target-blank.md): Prevent usage of unsafe `target='_blank'`
* [inferno/jsx-no-undef](docs/rules/jsx-no-undef.md): Disallow undeclared variables in JSX
* [inferno/jsx-one-expression-per-line](docs/rules/jsx-one-expression-per-line.md): Limit to one expression per line in JSX
* [inferno/jsx-curly-brace-presence](docs/rules/jsx-curly-brace-presence.md): Enforce curly braces or disallow unnecessary curly braces in JSX
* [inferno/jsx-fragments](docs/rules/jsx-fragments.md): Enforce shorthand or standard form for Inferno fragments
* [inferno/jsx-pascal-case](docs/rules/jsx-pascal-case.md): Enforce PascalCase for user-defined JSX components
* [inferno/jsx-props-no-multi-spaces](docs/rules/jsx-props-no-multi-spaces.md): Disallow multiple spaces between inline JSX props (fixable)
* [inferno/jsx-props-no-spreading](docs/rules/jsx-props-no-spreading.md): Disallow JSX props spreading
* [inferno/jsx-sort-default-props](docs/rules/jsx-sort-default-props.md): Enforce default props alphabetical sorting
* [inferno/jsx-sort-props](docs/rules/jsx-sort-props.md): Enforce props alphabetical sorting (fixable)
* [inferno/jsx-space-before-closing](docs/rules/jsx-space-before-closing.md): Validate spacing before closing bracket in JSX (fixable)
* [inferno/jsx-tag-spacing](docs/rules/jsx-tag-spacing.md): Validate whitespace in and around the JSX opening and closing brackets (fixable)
* [inferno/jsx-uses-inferno](docs/rules/jsx-uses-inferno.md): Prevent Inferno to be incorrectly marked as unused
* [inferno/jsx-uses-vars](docs/rules/jsx-uses-vars.md): Prevent variables used in JSX to be incorrectly marked as unused
* [inferno/jsx-wrap-multilines](docs/rules/jsx-wrap-multilines.md): Prevent missing parentheses around multilines JSX (fixable)

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

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

The rules enabled in this configuration are:

* [inferno/jsx-key](docs/rules/jsx-key.md)
* [inferno/jsx-no-comment-textnodes](docs/rules/jsx-no-comment-textnodes.md)
* [inferno/jsx-no-duplicate-props](docs/rules/jsx-no-duplicate-props.md)
* [inferno/jsx-no-target-blank](docs/rules/jsx-no-target-blank.md)
* [inferno/jsx-no-undef](docs/rules/jsx-no-undef.md)
* [inferno/jsx-uses-inferno](docs/rules/jsx-uses-inferno.md)
* [inferno/jsx-uses-vars](docs/rules/jsx-uses-vars.md)
* [inferno/no-children-prop](docs/rules/no-children-prop.md)
* [inferno/no-danger-with-children](docs/rules/no-danger-with-children.md)
* [inferno/no-direct-mutation-state](docs/rules/no-direct-mutation-state.md)
* [inferno/no-find-dom-node](docs/rules/no-find-dom-node.md)
* [inferno/no-is-mounted](docs/rules/no-is-mounted.md)
* [inferno/no-render-return-value](docs/rules/no-render-return-value.md)
* [inferno/no-string-refs](docs/rules/no-string-refs.md)
* [inferno/no-unescaped-entities](docs/rules/no-unescaped-entities.md)
* [inferno/no-unknown-property](docs/rules/no-unknown-property.md)
* [inferno/prop-types](docs/rules/prop-types.md)
* [inferno/inferno-in-jsx-scope](docs/rules/inferno-in-jsx-scope.md)
* [inferno/require-render-return](docs/rules/require-render-return.md)

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

**Note**: These configurations will import `eslint-plugin-inferno` and enable JSX in [parser options](http://eslint.org/docs/user-guide/configuring#specifying-parser-options).

# License

ESLint-plugin-Inferno is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).


[npm-url]: https://npmjs.org/package/eslint-plugin-inferno
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-inferno.svg
