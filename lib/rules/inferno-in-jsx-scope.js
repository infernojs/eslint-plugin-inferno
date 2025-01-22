/**
 * @fileoverview Prevent missing Inferno when using JSX
 * @author Glen Mailer
 */

'use strict';

const variableUtil = require('../util/variable');
const pragmaUtil = require('../util/pragma');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

const messages = {
  notInScope: '\'{{name}}\' must be in scope when using JSX',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow missing Inferno when using JSX',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('inferno-in-jsx-scope'),
    },

    messages,

    schema: [],
  },

  create(context) {
    const pragma = pragmaUtil.getFromContext(context);

    function checkIfInfernoIsInScope(node) {
      if (variableUtil.getVariableFromContext(context, node, pragma)) {
        return;
      }
      report(context, messages.notInScope, 'notInScope', {
        node,
        data: {
          name: pragma,
        },
      });
    }

    return {
      JSXOpeningElement: checkIfInfernoIsInScope,
      JSXOpeningFragment: checkIfInfernoIsInScope,
    };
  },
};
