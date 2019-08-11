/**
 * @fileoverview Report when a DOM element is using both children and dangerouslySetInnerHTML
 * @author David Petersen
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-danger-with-children');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
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
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `
    },
    {
      code: `
        const moreProps = { className: "eslint" };
        const props = { children: "Children", ...moreProps };
        <div {...props} />
      `
    },
    {
      code: `
        const otherProps = { children: "Children" };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `
    },
    {
      code: '<Hello>Children</Hello>'
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />'
    },
    {
      code: `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
        </Hello>
      `
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
    },
    {
      code: '<Hello {...undefined}>Children</Hello>'
    },
    {
      code: 'Inferno.createElement("Hello", undefined, "Children")'
    },
    {
      code: `
        const props = {...props, scratch: {mode: 'edit'}};
        const component = shallow(<TaskEditableTitle {...props} />);
      `
    }
  ],
  invalid: [
    {
      code: `
        <div dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </div>
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props}>Children</div>
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </Hello>
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}> </Hello>',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        Inferno.createElement(
          "div",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        Inferno.createElement(
          "div",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        Inferno.createElement(
          "Hello",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        Inferno.createElement(
          "Hello",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        Inferno.createElement("div", props, "Children");
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        Inferno.createElement("div", props);
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: `
        const moreProps = { children: "Children" };
        const otherProps = { ...moreProps };
        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };
        Inferno.createElement("div", props);
      `,
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    }
  ]
});
