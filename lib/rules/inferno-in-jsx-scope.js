/**
 * @fileoverview Prevent missing Inferno when using JSX
 * @author Glen Mailer
 */

'use strict';

const variableUtil = require('../util/variable');
const pragmaUtil = require('../util/pragma');
const docsUrl = require('../util/docsUrl');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent missing Inferno when using JSX',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('inferno-in-jsx-scope')
    },

    messages: {
      notInScope: '\'{{name}}\' must be in scope when using JSX'
    },

    schema: []
  },

  create(context) {
    const pragma = pragmaUtil.getFromContext(context);

    function checkIfInfernoIsInScope(node) {
      const variables = variableUtil.variablesInScope(context);
      if (variableUtil.findVariable(variables, pragma)) {
        return;
      }
      context.report({
        node,
        messageId: 'notInScope',
        data: {
          name: pragma
        }
      });
    }

    return {
      JSXOpeningElement: checkIfInfernoIsInScope,
      JSXOpeningFragment: checkIfInfernoIsInScope
    };
  }
};
