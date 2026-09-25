# Change Log
## Unreleased
- `inferno/jsx-no-constructed-context-values` rule removed, InfernoJS does not have context providers.
- `inferno/no-is-mounted` rule removed (also from `recommended`), InfernoJS components do not have `isMounted`.
- `inferno/style-prop-object` rule removed, InfernoJS accepts `style` as a string.
- bugfix: `no-unknown-property` allows `font-variant`, pointer events and lowercase native event handlers (e.g. `onchange`)
- bugfix: `jsx-no-duplicate-props` reports `class`/`className`, `for`/`htmlFor` and `onDoubleClick`/`onDblClick` on DOM elements
- bugfix: `jsx-props-class-name` only checks DOM elements and does not autofix into a duplicate prop
- bugfix: `forbid-component-props` forbids `class` by default, and `allowedFor` matches names like `A.B.C`
- bugfix: `inferno-in-jsx-scope` marks the pragma as used, so `no-unused-vars` does not report it
- bugfix: `require-render-return` and `prefer-stateless-function` check every component in a file
- bugfix: `sort-comp` reports every mis-ordered component in a file
- bugfix: `@extends Inferno.Component` JSDoc is detected on exported classes with ESLint 10
- bugfix: `createElement` imported from `inferno-create-element` or `inferno-compat` is detected
- bugfix: `no-invalid-html-attribute` respects the pragma setting
- bugfix: `void-dom-elements-no-children` detects children when the props argument is not an object
- bugfix: `jsx-no-target-blank` respects `links: false`, and `allowReferrer` for forms
- bugfix: `jsx-curly-brace-presence` no longer loops with `propElementValues: 'never'` or changes text with HTML entities
- bugfix: `no-arrow-function-lifecycle` autofix keeps destructured/default parameters and `async`
- bugfix: `function-component-definition` does not autofix declarations with several declarators
- bugfix: `no-danger` does not crash on namespaced elements and matches names like `A.B.C`
- bugfix: `jsx-one-expression-per-line` autofix keeps the space between text and an element
- bugfix: `jsx-props-no-multi-spaces` allows comments between props
- bugfix: `jsx-tag-spacing`, `jsx-space-before-closing`, `jsx-equals-spacing`, `jsx-closing-bracket-location` and `jsx-wrap-multilines` autofixes do not delete comments

## 2026-02-14 (7.40.0)
- Support eslint v10
- Support 'closedby' -> 'dialog' attribute

## 2025-01-23 (7.37.7)
- bugfix: Allow using 'selectedIndex' attribute on select elements

## 2025-01-23 (7.37.6)
- bugfix: allow using lowercased variants of semi-synthetic events  
- bugfix: added intermediate as allowed attribute

### Added
* [`jsx-props-no-multi-spaces`]: improve autofix for multi-line ([#3930][] @justisb)
* [`jsx-handler-names`]: support namespaced component names ([#3943][] @takuji)
* [`jsx-no-leaked-render`]: add `ignoreAttributes` option ([#3441][] @aleclarson)
* [`jsx-sort-props`]: add `sortFirst` option ([#3965][] @loderunner)
* [`jsx-no-literals`]: add `restrictedAttributes` option ([#3950][] @ushiboy)
* [`forbid-dom-props`]: Add `disallowedValues` option for forbidden props ([#3877][] @makxca)

### Fixed
* [`no-unknown-property`]: allow `onLoad` on `body` ([#3923][] @DerekStapleton)
* [`no-unknown-property`]: allow `closedby` on `dialog` ([#3980][] @ljharb)
* [`no-unknown-property`]: add `onScrollEnd` and `onScrollEndCapture` events as known properties ([#3958][] @xfeeefeee)
* Remove extra space from CLI warning ([#3942][] @junaidkbr)
* [`jsx-key`]: detect missing keys in return statement with ternary operator ([#3928][] @hyeonbinHur)
* [`jsx-key`]: detect missing keys in logical expressions ([#3986][] @yalperg)

### Changed
* [Docs] [`no-array-index-key`]: add template literal examples ([#3978][] @akahoshi1421)

[#3986]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3986
[#3978]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3978
[#3958]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3958
[#3980]: https://github.com/jsx-eslint/eslint-plugin-react/issues/3980
[#3965]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3965
[#3950]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3950
[#3943]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3943
[#3942]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3942
[#3930]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3930
[#3928]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3928
[#3923]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3923
[#3877]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3877
[#3441]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3441

## [7.37.5] - 2025.04.03

### Fixed
* [`no-unknown-property`]: allow shadow root attrs on `<template>` ([#3912][] @ljharb)
* [`prop-types`]: support `ComponentPropsWithRef` from a namespace import ([#3651][] @corydeppen)
* [`jsx-no-constructed-context-values`]: detect constructed context values in React 19 `<Context>` usage ([#3910][] @TildaDares)
* [`no-unknown-property`]: allow `transform-origin` on `rect` ([#3914][] @ljharb)

### Changed
* [Docs] [`button-has-type`]: clean up phrasing ([#3909][] @hamirmahal)

[7.37.5]: https://github.com/jsx-eslint/eslint-plugin-react/compare/v7.37.4...v7.37.5
[#3914]: https://github.com/jsx-eslint/eslint-plugin-react/issues/3914
[#3912]: https://github.com/jsx-eslint/eslint-plugin-react/issues/3912
[#3910]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3910
[#3909]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3909
[#3651]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3651

## 2025-01-23 (7.37.5)
- bugfix: Do not raise errors for InfernoJs optimization flags
- bugfix: DO not raise error for Functional component hooks
- bugfix: Changed `inferno/no-unknown-property` to better support InfernoJS attributes

## 2025-01-22

Everything re-branched from upstream.
All bug fixes included from upstream.

- **Support Eslint v9 flat configs**
- `inferno/jsx-uses-inferno` rule removed, as JSX compiler will handle it.
- `"react/boolean-prop-naming"` rule ported for Typescript / Flow users as `"inferno/boolean-prop-naming"`
- "resolve" dependency removed


## 2023-10-23

NodeJS v20 required.

Everything re-branched from upstream.
All bug fixes included from upstream.

Following polyfills have been removed:
```
"array.prototype.findlast"
"array.prototype.toreversed"
```

All notable changes to this project will be documented in this file.
## 2023-10-23
Everything re-branched from upstream.
All bug fixes included from upstream.

Following polyfills have been removed:
```
"array.prototype.flatmap"
"object.entries"
"object.fromentries"
"object.hasown"
"object.values"
```

## 2023-04-09
Everything re-branched from upstream.
All bug fixes included from upstream.
* [`sort-prop-types`]: give errors on TS types ([#3615][] @akulsr0)
* [`no-invalid-html-attribute`]: add support for `apple-touch-startup-image` `rel` attributes in `link` tags ([#3638][] @thomashockaday)
* [`no-unknown-property`]: add requireDataLowercase option ([#3645][] @HermanBilous)
* [`no-unknown-property`]: add `displaystyle` on `<math>` ([#3652][] @lounsbrough)
* [`prefer-read-only-props`], [`prop-types`], component detection: allow components to be async functions ([#3654][] @pnodet)
* [`no-unknown-property`]: support `onResize` on audio/video tags ([#3662][] @caesar1030)

### Fixed
* [`jsx-no-leaked-render`]: preserve RHS parens for multiline jsx elements while fixing ([#3623][] @akulsr0)
* [`jsx-key`]: detect conditional returns ([#3630][] @yialo)
* [`jsx-newline`]: prevent a crash when `allowMultilines ([#3633][] @ljharb)

### Changed
* [Refactor] `propTypes`: extract type params to var ([#3634][] @HenryBrown0)
* [Refactor] [`boolean-prop-naming`]: invert if statement ([#3634][] @HenryBrown0)
* [Refactor] [`function-component-definition`]: exit early if no type params ([#3634][] @HenryBrown0)
* [Refactor] [`jsx-props-no-multi-spaces`]: extract type parameters to var ([#3634][] @HenryBrown0)
* [Docs] [`jsx-key`]: fix correct example ([#3656][] @developer-bandi)

[#3662]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3662
[#3656]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3656
[#3654]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3654
[#3652]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3652
[#3645]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3645
[#3638]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3638
[#3634]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3634
[#3633]: https://github.com/jsx-eslint/eslint-plugin-react/issues/3633
[#3630]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3630
[#3623]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3623
[#3615]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3615

## [7.33.2] - 2023.08.15

### Fixed
* [`no-deprecated`]: prevent false positive on commonjs import ([#3614][] @akulsr0)
* [`no-unsafe`]: report on the method instead of the entire component (@ljharb)
* [`no-deprecated`]: report on the destructured property instead of the entire variable declarator (@ljharb)
* [`no-deprecated`]: report on the imported specifier instead of the entire import statement (@ljharb)
* [`no-invalid-html-attribute`]: report more granularly (@ljharb)

[7.33.2]: https://github.com/jsx-eslint/eslint-plugin-react/compare/v7.33.1...v7.33.2
[#3614]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3614

## [7.33.1] - 2023.07.29

### Fixed
* [`require-default-props`]: fix config schema ([#3605][] @controversial)
* [`jsx-curly-brace-presence`]: Revert [#3538][] due to issues with intended string type casting usage ([#3611][] @taozhou-glean)
* [`sort-prop-types`]: ensure sort-prop-types respects noSortAlphabetically ([#3610][] @caesar1030)

[7.33.1]: https://github.com/jsx-eslint/eslint-plugin-react/compare/v7.33.0...v7.33.1
[#3611]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3611
[#3610]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3610
[#3605]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3605

## [7.33.0] - 2023.07.19

### Added
* [`forbid-component-props`]: add `disallowedFor` option ([#3417][] @jacketwpbb)
* [`no-unused-state`]: avoid crashing on a class field function with destructured state ([#3568][] @ljharb)
* [`no-unused-prop-types`]: allow using spread with object expression in jsx ([#3570][] @akulsr0)
* Revert "[`destructuring-assignment`]: Handle destructuring of useContext in SFC" ([#3583][] [#2797][] @102)
* [`prefer-read-only-props`]: add TS support ([#3593][] @HenryBrown0)
### Changed
* [Docs] [`jsx-newline`], [`no-unsafe`], [`static-property-placement`]: Fix code syntax highlighting ([#3563][] @nbsp1221)
* [readme] resore configuration URL ([#3582][] @gokaygurcan)
* [Docs] [`jsx-no-bind`]: reword performance rationale ([#3581][] @gpoole)
- [Docs] [`jsx-first-prop-new-line`]: add missing `multiprop` value ([#3598][] @dzek69)

[7.33.0]: https://github.com/jsx-eslint/eslint-plugin-react/compare/v7.32.2...v7.33.0
[#3598]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3598
[#3593]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3593
[#3583]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3583
[#3582]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3582
[#3581]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3581
[#3570]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3570
[#3568]: https://github.com/jsx-eslint/eslint-plugin-react/issues/3568
[#3563]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3563
[#3417]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3417

## 2023-01-22
Everything re-branched from upstream.
All bug fixes included from upstream.

## 2022-09-11
Everything re-branched from upstream.
All bug fixes included from upstream.

## 2022-07-26
Everything re-branched from upstream.
All bug fixes included from upstream.
## 2022-03-07
Everything re-branched from upstream.
All bug fixes included from upstream.

## 2022-02-19
Everything re-branched from upstream.
All bug fixes included from upstream.

New rules:

- void-dom-elements-no-children
- no-unused-class-component-methods
- no-namespace
- no-arrow-function-lifecycle
- no-invalid-html-attribute
- iframe-missing-sandbox

## 2021-04-16
Everything re-branched from upstream.
All bug fixes included from upstream.

## 2020-05-29
Everything re-branched from upstream.
All bug fixes included from upstream.

## 2019-08-11
Everything re-branched from upstream.
All bug fixes included from upstream.

New rules:
- jsx-curly-newline
- jsx-fragments
- jsx-props-no-spreading
- state-in-constructor
- static-property-placement

- inferno/jsx-props-class-name
[`no-object-type-as-default-prop`]: docs/rules/no-object-type-as-default-prop.md
[`sort-default-props`]: docs/rules/sort-default-props.md
