/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */

'use strict';

const makeNoMethodSetStateRule = require('../util/makeNoMethodSetStateRule');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = makeNoMethodSetStateRule(
  'componentWillUpdate',
);
