/**
 * @fileoverview Tests for no-array-index-key
 * @author Joe Lencioni
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-array-index-key');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-array-index-key', rule, {
  valid: [
    {code: '<Foo key="foo" />;'},
    {code: '<Foo key={i} />;'},
    {code: '<Foo key />;'},
    {code: '<Foo key={`foo-${i}`} />;'},
    {code: '<Foo key={\'foo-\' + i} />;'},

    {
      code: 'foo.bar((baz, i) => <Foo key={i} />)'
    },

    {
      code: 'foo.bar((bar, i) => <Foo key={`foo-${i}`} />)'
    },

    {
      code: 'foo.bar((bar, i) => <Foo key={\'foo-\' + i} />)'
    },

    {
      code: 'foo.map((baz) => <Foo key={baz.id} />)'
    },

    {
      code: 'foo.map((baz, i) => <Foo key={baz.id} />)'
    },

    {
      code: 'foo.map((baz, i) => <Foo key={\'foo\' + baz.id} />)'
    },

    {
      code: 'foo.map((baz, i) => Inferno.cloneElement(someChild, { ...someChild.props }))'
    },

    {
      code: `
        foo.map((item, i) => {
          return Inferno.cloneElement(someChild, {
            key: item.id
          })
        })
      `
    },

    {
      code: 'foo.map((baz, i) => <Foo key />)'
    },

    {
      code: 'foo.reduce((a, b) => a.concat(<Foo key={b.id} />), [])'
    },

    {
      code: 'foo.reduce((a, b, i) => a.concat(<Foo key={b.id} />), [])'
    },

    {
      code: 'foo.reduceRight((a, b) => a.concat(<Foo key={b.id} />), [])'
    },

    {
      code: 'foo.reduceRight((a, b, i) => a.concat(<Foo key={b.id} />), [])'
    },

    {
      code: `
      Inferno.Children.map(this.props.children, (child, index, arr) => {
        return Inferno.cloneElement(child, { key: child.id });
      })
      `
    },

    {
      code: `
      Children.forEach(this.props.children, (child, index, arr) => {
        return Inferno.cloneElement(child, { key: child.id });
      })
      `
    }
  ],

  invalid: [
    {
      code: 'foo.map((bar, i) => <Foo key={i} />)',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: '[{}, {}].map((bar, i) => <Foo key={i} />)',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, anything) => <Foo key={anything} />)',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => <Foo key={`foo-${i}`} />)',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => <Foo key={\'foo-\' + i} />)',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => <Foo key={\'foo-\' + i + \'-bar\'} />)',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((baz, i) => Inferno.cloneElement(someChild, { ...someChild.props, key: i }))',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: `
        foo.map((item, i) => {
          return Inferno.cloneElement(someChild, {
            key: i
          })
        })
      `,
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.forEach((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.filter((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.some((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.every((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.find((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.findIndex((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.reduce((a, b, i) => a.concat(<Foo key={i} />), [])',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.reduceRight((a, b, i) => a.concat(<Foo key={i} />), [])',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: i }))',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: `foo-${i}` }))',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: \'foo-\' + i }))',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: \'foo-\' + i + \'-bar\' }))',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.forEach((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.filter((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.some((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.every((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.find((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: 'foo.findIndex((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: `
      Children.map(this.props.children, (child, index) => {
        return Inferno.cloneElement(child, { key: index });
      })
      `,
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: `
      Inferno.Children.map(this.props.children, (child, index) => {
        return Inferno.cloneElement(child, { key: index });
      })
      `,
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: `
      Children.forEach(this.props.children, (child, index) => {
        return Inferno.cloneElement(child, { key: index });
      })
      `,
      errors: [{message: 'Do not use Array index in keys'}]
    },

    {
      code: `
      Inferno.Children.forEach(this.props.children, (child, index) => {
        return Inferno.cloneElement(child, { key: index });
      })
      `,
      errors: [{message: 'Do not use Array index in keys'}]
    }

  ]
});
