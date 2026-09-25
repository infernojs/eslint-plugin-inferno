'use strict';

const astUtil = require('./ast');
const pragmaUtil = require('./pragma');
const variableUtil = require('./variable');

/**
 * Check if a module is the pragma package or one of its sub-packages,
 * e.g. `createElement` is exported by `inferno-create-element` and `inferno-compat`, not `inferno`
 * @param {unknown} source The module name
 * @param {string} pragma
 * @returns {boolean}
 */
function isPragmaPackage(source, pragma) {
  const pragmaPackage = pragma.toLocaleLowerCase();
  return typeof source === 'string' && (source === pragmaPackage || source.startsWith(`${pragmaPackage}-`));
}

/**
 * Check if variable is destructured from pragma import
 *
 * @param {Context} context eslint context
 * @param {ASTNode} node The AST node to check
 * @param {string} variable The variable name to check
 * @returns {boolean} True if createElement is destructured from the pragma
 */
module.exports = function isDestructuredFromPragmaImport(context, node, variable) {
  const pragma = pragmaUtil.getFromContext(context);
  const variableInScope = variableUtil.getVariableFromContext(context, node, variable);
  if (variableInScope) {
    const latestDef = variableUtil.getLatestVariableDefinition(variableInScope);
    if (latestDef) {
      // check if latest definition is a variable declaration: 'variable = value'
      if (latestDef.node.type === 'VariableDeclarator' && latestDef.node.init) {
        // check for: 'variable = pragma.variable'
        if (
          latestDef.node.init.type === 'MemberExpression'
          && latestDef.node.init.object.type === 'Identifier'
          && latestDef.node.init.object.name === pragma
        ) {
          return true;
        }
        // check for: '{variable} = pragma'
        if (
          latestDef.node.init.type === 'Identifier'
          && latestDef.node.init.name === pragma
        ) {
          return true;
        }

        // "require('inferno')" or "require('inferno-create-element')"
        let requireExpression = null;

        // get "require('inferno')" from: "{variable} = require('inferno')"
        if (astUtil.isCallExpression(latestDef.node.init)) {
          requireExpression = latestDef.node.init;
        }
        // get "require('inferno')" from: "variable = require('inferno').variable"
        if (
          !requireExpression
          && latestDef.node.init.type === 'MemberExpression'
          && astUtil.isCallExpression(latestDef.node.init.object)
        ) {
          requireExpression = latestDef.node.init.object;
        }

        // check proper require.
        if (
          requireExpression
          && requireExpression.callee
          && requireExpression.callee.name === 'require'
          && requireExpression.arguments[0]
          && isPragmaPackage(requireExpression.arguments[0].value, pragma)
        ) {
          return true;
        }

        return false;
      }

      // latest definition is an import declaration: import {<variable>} from 'inferno' or 'inferno-create-element'
      if (
        latestDef.parent
        && latestDef.parent.type === 'ImportDeclaration'
        && isPragmaPackage(latestDef.parent.source.value, pragma)
      ) {
        return true;
      }
    }
  }
  return false;
};
