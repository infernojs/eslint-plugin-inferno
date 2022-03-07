/**
 * @fileoverview Tests for no-array-index-key
 * @author Joe Lencioni
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-array-index-key');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-array-index-key', rule, {
  valid: parsers.all(
    { code: '<Foo key="foo" />;' },
    { code: '<Foo key={i} />;' },
    { code: '<Foo key />;' },
    { code: '<Foo key={`foo-${i}`} />;' },
    { code: '<Foo key={\'foo-\' + i} />;' },
    {
      code: 'foo.bar((baz, i) => <Foo key={i} />)',
    },
    {
      code: 'foo.bar((bar, i) => <Foo key={`foo-${i}`} />)',
    },
    {
      code: 'foo.bar((bar, i) => <Foo key={\'foo-\' + i} />)',
    },
    {
      code: 'foo.map((baz) => <Foo key={baz.id} />)',
    },
    {
      code: 'foo.map((baz, i) => <Foo key={baz.id} />)',
    },
    {
      code: 'foo.map((baz, i) => <Foo key={\'foo\' + baz.id} />)',
    },
    {
      code: 'foo.map((baz, i) => Inferno.cloneElement(someChild, { ...someChild.props }))',
    },
    {
      code: 'foo.map((baz, i) => cloneElement(someChild, { ...someChild.props }))',
    },
    {
      code: `
        foo.map((item, i) => {
          return Inferno.cloneElement(someChild, {
            key: item.id
          })
        })
      `,
    },
    {
      code: `
        foo.map((item, i) => {
          return cloneElement(someChild, {
            key: item.id
          })
        })
      `,
    },
    {
      code: 'foo.map((baz, i) => <Foo key />)',
    },
    {
      code: 'foo.reduce((a, b) => a.concat(<Foo key={b.id} />), [])',
    },
    {
      code: 'foo.map((bar, i) => <Foo key={i.baz.toString()} />)',
    },
    {
      code: 'foo.map((bar, i) => <Foo key={i.toString} />)',
    },
    {
      code: 'foo.map((bar, i) => <Foo key={String()} />)',
    },
    {
      code: 'foo.map((bar, i) => <Foo key={String(baz)} />)',
    },
    {
      code: 'foo.reduce((a, b) => a.concat(<Foo key={b.id} />), [])',
    },
    {
      code: 'foo.reduce((a, b, i) => a.concat(<Foo key={b.id} />), [])',
    },
    {
      code: 'foo.reduceRight((a, b) => a.concat(<Foo key={b.id} />), [])',
    },
    {
      code: 'foo.reduceRight((a, b, i) => a.concat(<Foo key={b.id} />), [])',
    },
    {
      code: `
        Inferno.Children.map(this.props.children, (child, index, arr) => {
          return Inferno.cloneElement(child, { key: child.id });
        })
      `,
    },
    {
      code: `
        Inferno.Children.map(this.props.children, (child, index, arr) => {
          return cloneElement(child, { key: child.id });
        })
      `,
    },
    {
      code: `
        Children.forEach(this.props.children, (child, index, arr) => {
          return Inferno.cloneElement(child, { key: child.id });
        })
      `,
    },
    {
      code: `
        Children.forEach(this.props.children, (child, index, arr) => {
          return cloneElement(child, { key: child.id });
        })
      `,
    },
    {
      code: 'foo?.map(child => <Foo key={child.i} />)',
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
    }
  ),

  invalid: parsers.all([].concat(
    {
      code: 'foo.map((bar, i) => <Foo key={i} />)',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: '[{}, {}].map((bar, i) => <Foo key={i} />)',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, anything) => <Foo key={anything} />)',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => <Foo key={`foo-${i}`} />)',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => <Foo key={\'foo-\' + i} />)',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => <Foo key={\'foo-\' + i + \'-bar\'} />)',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((baz, i) => Inferno.cloneElement(someChild, { ...someChild.props, key: i }))',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneElement } from 'inferno';

        foo.map((baz, i) => cloneElement(someChild, { ...someChild.props, key: i }))
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        foo.map((item, i) => {
          return Inferno.cloneElement(someChild, {
            key: i
          })
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneElement } from 'inferno';

        foo.map((item, i) => {
          return cloneElement(someChild, {
            key: i
          })
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneVNode } from 'inferno-clone-vnode';

        foo.map((item, i) => {
          return cloneVNode(someChild, {
            key: i
          })
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.forEach((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.filter((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.some((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.every((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.find((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.findIndex((bar, i) => { baz.push(<Foo key={i} />); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.reduce((a, b, i) => a.concat(<Foo key={i} />), [])',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.reduceRight((a, b, i) => a.concat(<Foo key={i} />), [])',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: i }))',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: `foo-${i}` }))',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: \'foo-\' + i }))',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.map((bar, i) => Inferno.createElement(\'Foo\', { key: \'foo-\' + i + \'-bar\' }))',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.forEach((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.filter((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.some((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.every((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.find((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo.findIndex((bar, i) => { baz.push(Inferno.createElement(\'Foo\', { key: i })); })',
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        Children.map(this.props.children, (child, index) => {
          return Inferno.cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneElement } from 'inferno';

        Children.map(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        Inferno.Children.map(this.props.children, (child, index) => {
          return Inferno.cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneElement } from 'inferno';

        Inferno.Children.map(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        Children.forEach(this.props.children, (child, index) => {
          return Inferno.cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneElement } from 'inferno';

        Children.forEach(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        Inferno.Children.forEach(this.props.children, (child, index) => {
          return Inferno.cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        import { cloneElement } from 'inferno';

        Inferno.Children.forEach(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: 'foo?.map((child, i) => <Foo key={i} />)',
      errors: [{ messageId: 'noArrayIndex' }],
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    {
      code: `
        foo.map((bar, index) => (
          <Element key={index.toString()} bar={bar} />
        ))
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        foo.map((bar, index) => (
          <Element key={String(index)} bar={bar} />
        ))
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    },
    {
      code: `
        foo.map((bar, index) => (
          <Element key={index} bar={bar} />
        ))
      `,
      errors: [{ messageId: 'noArrayIndex' }],
    }
  )),
});
