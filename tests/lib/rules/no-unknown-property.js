/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unknown-property');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unknown-property', rule, {
  valid: [
    {code: '<App class="bar" />;'},
    {code: '<App for="bar" />;'},
    {code: '<App accept-charset="bar" />;'},
    {code: '<App http-equiv="bar" />;'},
    {code: '<App xlink:href="bar" />;'},
    {code: '<App clip-path="bar" />;'},
    {code: '<div className="bar"></div>;'},
    {code: '<div data-foo="bar"></div>;'},
    {code: '<div class="foo" is="my-elem"></div>;'},
    {code: '<div {...this.props} class="foo" is="my-elem"></div>;'},
    {code: '<atom-panel class="foo"></atom-panel>;'}, {
      code: '<div class="bar"></div>;',
      options: [{ignore: ['class']}]
    }
  ],
  invalid: [{
    code: '<div accept-charset="bar"></div>;',
    output: '<div acceptCharset="bar"></div>;',
    errors: [{message: 'Unknown property \'accept-charset\' found, use \'acceptCharset\' instead'}]
  }, {
    code: '<div http-equiv="bar"></div>;',
    output: '<div httpEquiv="bar"></div>;',
    errors: [{message: 'Unknown property \'http-equiv\' found, use \'httpEquiv\' instead'}]
  }, {
    code: '<div accesskey="bar"></div>;',
    output: '<div accessKey="bar"></div>;',
    errors: [{message: 'Unknown property \'accesskey\' found, use \'accessKey\' instead'}]
  }, {
    code: '<div onclick="bar"></div>;',
    output: '<div onClick="bar"></div>;',
    errors: [{message: 'Unknown property \'onclick\' found, use \'onClick\' instead'}]
  }, {
    code: '<div onmousedown="bar"></div>;',
    output: '<div onMouseDown="bar"></div>;',
    errors: [{message: 'Unknown property \'onmousedown\' found, use \'onMouseDown\' instead'}]
  }]
});
