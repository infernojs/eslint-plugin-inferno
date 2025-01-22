/**
 * @fileoverview Tests for jsx-fragments
 * @author Alex Zherdev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-fragments');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  inferno: {
    pragma: 'Act',
    fragment: 'Frag',
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-fragments', rule, {
  valid: parsers.all([
    {
      code: '<><Foo /></>',
      features: ['fragment', 'no-ts-old'],
      settings,
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      options: ['element'],
      settings,
    },
    {
      code: '<Act.Frag />',
      options: ['element'],
      settings,
    },
    {
      code: `
        import Act, { Frag as F } from 'inferno';
        <F><Foo /></F>;
      `,
      options: ['element'],
      settings,
    },
    {
      code: `
        const F = Act.Frag;
        <F><Foo /></F>;
      `,
      options: ['element'],
      settings,
    },
    {
      code: `
        const { Frag } = Act;
        <Frag><Foo /></Frag>;
      `,
      options: ['element'],
      settings,
    },
    {
      code: `
        const { Frag } = require('inferno');
        <Frag><Foo /></Frag>;
      `,
      options: ['element'],
      settings,
    },
    {
      code: '<Act.Frag key="key"><Foo /></Act.Frag>',
      options: ['syntax'],
      settings,
    },
    {
      code: '<Act.Frag key="key" />',
      options: ['syntax'],
      settings,
    },
  ]),

  invalid: parsers.all([
    // {
    //   code: '<><Foo /></>',
    //   features: ['fragment', 'no-ts-old'],
    //   settings, // old
    //   errors: [
    //     { messageId: 'fragmentsNotSupported' },
    //   ],
    // },
    // {
    //   code: '<Act.Frag><Foo /></Act.Frag>',
    //   settings, // old
    //   errors: [
    //     { messageId: 'fragmentsNotSupported' },
    //   ],
    // },
    // {
    //   code: '<Act.Frag />',
    //   settings, // old
    //   errors: [
    //     { messageId: 'fragmentsNotSupported' },
    //   ],
    // },
    {
      code: '<><Foo /></>',
      output: '<Act.Frag><Foo /></Act.Frag>',
      features: ['fragment', 'no-ts-old'],
      options: ['element'],
      settings,
      errors: [
        {
          messageId: 'preferPragma',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: '<><Foo /></>',
      output: null, // should get '<Act.Frag><Foo /></Act.Frag>', but the old TS parser lacks opening/closing Fragment info
      features: ['fragment', 'no-babel', 'ts', 'no-ts-new'],
      options: ['element'],
      settings,
      errors: [
        {
          messageId: 'preferPragma',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: '<Act.Frag><Foo /></Act.Frag>',
      output: '<><Foo /></>',
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: '<Act.Frag />',
      output: '<></>',
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: `
        import Act, { Frag as F } from 'inferno';
        <F />;
      `,
      output: `
        import Act, { Frag as F } from 'inferno';
        <></>;
      `,
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: `
        import Act, { Frag as F } from 'inferno';
        <F><Foo /></F>;
      `,
      output: `
        import Act, { Frag as F } from 'inferno';
        <><Foo /></>;
      `,
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: `
        import Act, { Frag } from 'inferno';
        <Frag><Foo /></Frag>;
      `,
      output: `
        import Act, { Frag } from 'inferno';
        <><Foo /></>;
      `,
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: `
        const F = Act.Frag;
        <F><Foo /></F>;
      `,
      output: `
        const F = Act.Frag;
        <><Foo /></>;
      `,
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: `
        const { Frag } = Act;
        <Frag><Foo /></Frag>;
      `,
      output: `
        const { Frag } = Act;
        <><Foo /></>;
      `,
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
    {
      code: `
        const { Frag } = require('inferno');
        <Frag><Foo /></Frag>;
      `,
      output: `
        const { Frag } = require('inferno');
        <><Foo /></>;
      `,
      options: ['syntax'],
      settings,
      errors: [
        {
          messageId: 'preferFragment',
          data: { inferno: 'Act', fragment: 'Frag' },
        },
      ],
    },
  ]),
});
