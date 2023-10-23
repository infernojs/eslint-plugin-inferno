# Change Log
All notable changes to this project will be documented in this file.
## 2023-04-09
Everything re-branched from upstream.
All bug fixes included from upstream.
* [`sort-prop-types`]: give errors on TS types ([#3615][] @akulsr0)
* [`no-invalid-html-attribute`]: add support for `apple-touch-startup-image` `rel` attributes in `link` tags ([#3638][] @thomashockaday)

### Fixed
* [`jsx-no-leaked-render`]: preserve RHS parens for multiline jsx elements while fixing ([#3623][] @akulsr0)
* [`jsx-key`]: detect conditional returns ([#3630][] @yialo)
* [`jsx-newline`]: prevent a crash when `allowMultilines ([#3633][] @ljharb)

[#3638]: https://github.com/jsx-eslint/eslint-plugin-react/pull/3638
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
