/**
 * @fileoverview Prevent usage of deprecated methods
 * @author Yannick Croissant
 * @author Scott Feeney
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-deprecated');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-deprecated', rule, {
  invalid: [],
  valid: [
    // Not deprecated
    'var element = Inferno.createVNode(\'p\', {}, null);',
    'var clone = Inferno.cloneVNode(element);',
    'Inferno.render(element, container);',
    'Inferno.findDOMNode(instance);',
    'InfernoServer.renderToString(element);',
    'InfernoServer.renderToStaticMarkup(element);'
  ]
});
