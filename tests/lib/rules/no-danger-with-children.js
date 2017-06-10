/**
 * @fileoverview Report when a DOM element is using both children and dangerouslySetInnerHTML
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-danger-with-children');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-danger-with-children', rule, {
  valid: [
    {
      code: '<div>Children</div>'
    },
    {
      code: '<div {...props} />',
      globals: {
        props: true
      }
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} />'
    },
    {
      code: '<div children="Children" />'
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const moreProps = { className: "eslint" };',
        'const props = { children: "Children", ...moreProps };',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const otherProps = { children: "Children" };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: '<Hello>Children</Hello>'
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />'
    },
    {
      code: 'Inferno.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });'
    },
    {
      code: 'Inferno.createElement("div", {}, "Children");'
    },
    {
      code: 'Inferno.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });'
    },
    {
      code: 'Inferno.createElement("Hello", {}, "Children");'
    }
  ],
  invalid: [
    {
      code: [
        '<div dangerouslySetInnerHTML={{ __html: "HTML" }}>',
        '  Children',
        '</div>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props}>Children</div>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props} />'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>',
        '  Children',
        '</Hello>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'Inferno.createVNode(',
        '  "div",',
        '  { dangerouslySetInnerHTML: { __html: "HTML" } },',
        '  "Children"',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'Inferno.createVNode(',
        '  "div",',
        '  {',
        '    dangerouslySetInnerHTML: { __html: "HTML" },',
        '    children: "Children",',
        '  }',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'Inferno.createVNode(',
        '  "Hello",',
        '  { dangerouslySetInnerHTML: { __html: "HTML" } },',
        '  "Children"',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'Inferno.createVNode(',
        '  "Hello",',
        '  {',
        '    dangerouslySetInnerHTML: { __html: "HTML" },',
        '    children: "Children",',
        '  }',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        'Inferno.createVNode("div", props, "Children");'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };',
        'Inferno.createVNode("div", props);'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const moreProps = { children: "Children" };',
        'const otherProps = { ...moreProps };',
        'const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };',
        'Inferno.createVNode("div", props);'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    }
  ]
});
