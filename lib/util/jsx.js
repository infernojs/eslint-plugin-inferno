/**
 * @fileoverview Utility functions for JSX
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');

// See https://github.com/babel/babel/blob/ce420ba51c68591e057696ef43e028f41c6e04cd/packages/babel-types/src/validators/inferno/isCompatTag.js
// for why we only test for the first character
const COMPAT_TAG_REGEX = /^[a-z]/;

/**
 * Checks if a node represents a DOM element according to Inferno.
 * @param {object} node - JSXOpeningElement to check.
 * @returns {boolean} Whether or not the node corresponds to a DOM element.
 */
function isDOMComponent(node) {
  const name = elementType(node);
  return COMPAT_TAG_REGEX.test(name);
}

/**
 * Test whether a JSXElement is a fragment
 * @param {JSXElement} node
 * @param {string} infernoPragma
 * @param {string} fragmentPragma
 * @returns {boolean}
 */
function isFragment(node, infernoPragma, fragmentPragma) {
  const name = node.openingElement.name;

  // <Fragment>
  if (name.type === 'JSXIdentifier' && name.name === fragmentPragma) {
    return true;
  }

  // <Inferno.Fragment>
  if (
    name.type === 'JSXMemberExpression'
    && name.object.type === 'JSXIdentifier'
    && name.object.name === infernoPragma
    && name.property.type === 'JSXIdentifier'
    && name.property.name === fragmentPragma
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a node represents a JSX element or fragment.
 * @param {object} node - node to check.
 * @returns {boolean} Whether or not the node if a JSX element or fragment.
 */
function isJSX(node) {
  return node && ['JSXElement', 'JSXFragment'].indexOf(node.type) >= 0;
}

/**
 * Check if node is like `key={...}` as in `<Foo key={...} />`
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isJSXAttributeKey(node) {
  return node.type === 'JSXAttribute'
    && node.name
    && node.name.type === 'JSXIdentifier'
    && node.name.name === 'key';
}

/**
 * Check if value has only whitespaces
 * @param {string} value
 * @returns {boolean}
 */
function isWhiteSpaces(value) {
  return typeof value === 'string' ? /^\s*$/.test(value) : false;
}

module.exports = {
  isDOMComponent,
  isFragment,
  isJSX,
  isJSXAttributeKey,
  isWhiteSpaces
};
