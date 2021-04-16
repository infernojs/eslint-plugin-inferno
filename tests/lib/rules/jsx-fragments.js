/**
 * @fileoverview Tests for jsx-fragments
 * @author Alex Zherdev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-fragments');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  inferno: {
    pragma: 'Act',
    fragment: 'Frag'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-fragments', rule, {
  valid: [{
    code: '<><Foo /></>',
    parser: parsers.BABEL_ESLINT,
    settings
  }, {
    code: '<Act.Frag><Foo /></Act.Frag>',
    options: ['element'],
    settings
  }, {
    code: '<Act.Frag />',
    options: ['element'],
    settings
  }, {
    code: `
      import Act, { Frag as F } from 'inferno';
      <F><Foo /></F>;
    `,
    options: ['element'],
    settings
  }, {
    code: `
      const F = Act.Frag;
      <F><Foo /></F>;
    `,
    options: ['element'],
    settings
  }, {
    code: `
      const { Frag } = Act;
      <Frag><Foo /></Frag>;
    `,
    options: ['element'],
    settings
  }, {
    code: `
      const { Frag } = require('inferno');
      <Frag><Foo /></Frag>;
    `,
    options: ['element'],
    settings
  }, {
    code: '<Act.Frag key="key"><Foo /></Act.Frag>',
    options: ['syntax'],
    settings
  }, {
    code: '<Act.Frag key="key" />',
    options: ['syntax'],
    settings
  }],

  invalid: [{
    code: '<><Foo /></>',
    parser: parsers.BABEL_ESLINT,
    options: ['element'],
    settings,
    errors: [{
      messageId: 'preferPragma',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: '<Act.Frag><Foo /></Act.Frag>'
  }, {
    code: '<Act.Frag><Foo /></Act.Frag>',
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: '<><Foo /></>'
  }, {
    code: '<Act.Frag />',
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: '<></>'
  }, {
    code: `
      import Act, { Frag as F } from 'inferno';
      <F />;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: `
      import Act, { Frag as F } from 'inferno';
      <></>;
    `
  }, {
    code: `
      import Act, { Frag as F } from 'inferno';
      <F><Foo /></F>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: `
      import Act, { Frag as F } from 'inferno';
      <><Foo /></>;
    `
  }, {
    code: `
      import Act, { Frag } from 'inferno';
      <Frag><Foo /></Frag>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: `
      import Act, { Frag } from 'inferno';
      <><Foo /></>;
    `
  }, {
    code: `
      const F = Act.Frag;
      <F><Foo /></F>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: `
      const F = Act.Frag;
      <><Foo /></>;
    `
  }, {
    code: `
      const { Frag } = Act;
      <Frag><Foo /></Frag>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: `
      const { Frag } = Act;
      <><Foo /></>;
    `
  }, {
    code: `
      const { Frag } = require('inferno');
      <Frag><Foo /></Frag>;
    `,
    options: ['syntax'],
    settings,
    errors: [{
      messageId: 'preferFragment',
      data: {inferno: 'Act', fragment: 'Frag'}
    }],
    output: `
      const { Frag } = require('inferno');
      <><Foo /></>;
    `
  }]
});
