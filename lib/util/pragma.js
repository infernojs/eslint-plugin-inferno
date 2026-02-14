/**
 * @fileoverview Utility functions for Inferno pragma configuration
 * @author Yannick Croissant
 */

'use strict';

const getSourceCode = require('./eslint').getSourceCode;

const JSX_ANNOTATION_REGEX = /@jsx\s+([^\s]+)/;
// Does not check for reserved keywords or unicode characters
const JS_IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;

/**
 * @typedef {object} InfernoSettings
 * @property {string} [createClass]
 * @property {string} [fragment]
 * @property {string} [pragma]
 */

/**
 * @param {Context} context
 * @returns {InfernoSettings|undefined}
 */
function getInfernoSettings(context) {
  // `context.settings` is a record of user-defined settings.
  return /** @type {InfernoSettings|undefined} */ (context.settings.inferno);
}

/**
 * @param {Context} context
 * @returns {string}
 */
function getCreateClassFromContext(context) {
  let pragma = 'createClass';
  const infernoSettings = getInfernoSettings(context);
  // .eslintrc shared settings (https://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (infernoSettings && infernoSettings.createClass) {
    pragma = infernoSettings.createClass;
  }
  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`createClass pragma ${pragma} is not a valid function name`);
  }
  return pragma;
}

/**
 * @param {Context} context
 * @returns {string}
 */
function getFragmentFromContext(context) {
  let pragma = 'Fragment';
  const infernoSettings = getInfernoSettings(context);
  // .eslintrc shared settings (https://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (infernoSettings && infernoSettings.fragment) {
    pragma = infernoSettings.fragment;
  }
  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`Fragment pragma ${pragma} is not a valid identifier`);
  }
  return pragma;
}

/**
 * @param {Context} context
 * @returns {string}
 */
function getFromContext(context) {
  let pragma = 'Inferno';
  const infernoSettings = getInfernoSettings(context);

  const sourceCode = getSourceCode(context);
  const pragmaNode = sourceCode.getAllComments().find((node) => JSX_ANNOTATION_REGEX.test(node.value));

  if (pragmaNode) {
    const matches = JSX_ANNOTATION_REGEX.exec(pragmaNode.value);
    pragma = matches[1].split('.')[0];
    // .eslintrc shared settings (https://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (infernoSettings && infernoSettings.pragma) {
    pragma = infernoSettings.pragma;
  }

  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    console.warn(`Inferno pragma ${pragma} is not a valid identifier`);
    return 'Inferno';
  }
  return pragma;
}

module.exports = {
  getCreateClassFromContext,
  getFragmentFromContext,
  getFromContext,
};
