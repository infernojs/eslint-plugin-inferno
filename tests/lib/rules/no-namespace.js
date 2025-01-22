/**
 * @fileoverview Tests for jsx-no-namespace
 * @author Yacine Hmito
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-namespace');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-namespace', rule, {
  valid: parsers.all([
    {
      code: '<testcomponent />',
    },
    {
      code: 'Inferno.createElement("testcomponent")',
    },
    {
      code: '<testComponent />',
    },
    {
      code: 'Inferno.createElement("testComponent")',
    },
    {
      code: '<test_component />',
    },
    {
      code: 'Inferno.createElement("test_component")',
    },
    {
      code: '<TestComponent />',
    },
    {
      code: 'Inferno.createElement("TestComponent")',
    },
    {
      code: '<object.testcomponent />',
    },
    {
      code: 'Inferno.createElement("object.testcomponent")',
    },
    {
      code: '<object.testComponent />',
    },
    {
      code: 'Inferno.createElement("object.testComponent")',
    },
    {
      code: '<object.test_component />',
    },
    {
      code: 'Inferno.createElement("object.test_component")',
    },
    {
      code: '<object.TestComponent />',
    },
    {
      code: 'Inferno.createElement("object.TestComponent")',
    },
    {
      code: '<Object.testcomponent />',
    },
    {
      code: 'Inferno.createElement("Object.testcomponent")',
    },
    {
      code: '<Object.testComponent />',
    },
    {
      code: 'Inferno.createElement("Object.testComponent")',
    },
    {
      code: '<Object.test_component />',
    },
    {
      code: 'Inferno.createElement("Object.test_component")',
    },
    {
      code: '<Object.TestComponent />',
    },
    {
      code: 'Inferno.createElement("Object.TestComponent")',
    },
    {
      code: 'Inferno.createElement(null)',
    },
    {
      code: 'Inferno.createElement(true)',
    },
    {
      code: 'Inferno.createElement({})',
    },
  ]),

  invalid: parsers.all([
    {
      code: '<ns:testcomponent />',
      errors: [{ message: 'Inferno component ns:testcomponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("ns:testcomponent")',
      errors: [{ message: 'Inferno component ns:testcomponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<ns:testComponent />',
      errors: [{ message: 'Inferno component ns:testComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("ns:testComponent")',
      errors: [{ message: 'Inferno component ns:testComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<ns:test_component />',
      errors: [{ message: 'Inferno component ns:test_component must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("ns:test_component")',
      errors: [{ message: 'Inferno component ns:test_component must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<ns:TestComponent />',
      errors: [{ message: 'Inferno component ns:TestComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("ns:TestComponent")',
      errors: [{ message: 'Inferno component ns:TestComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:testcomponent />',
      errors: [{ message: 'Inferno component Ns:testcomponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("Ns:testcomponent")',
      errors: [{ message: 'Inferno component Ns:testcomponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:testComponent />',
      errors: [{ message: 'Inferno component Ns:testComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("Ns:testComponent")',
      errors: [{ message: 'Inferno component Ns:testComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:test_component />',
      errors: [{ message: 'Inferno component Ns:test_component must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("Ns:test_component")',
      errors: [{ message: 'Inferno component Ns:test_component must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:TestComponent />',
      errors: [{ message: 'Inferno component Ns:TestComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'Inferno.createElement("Ns:TestComponent")',
      errors: [{ message: 'Inferno component Ns:TestComponent must not be in a namespace, as Inferno does not support them' }],
      features: ['jsx namespace'],
    },
  ]),
});
