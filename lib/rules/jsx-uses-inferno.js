/**
 * @fileoverview Prevent Inferno to be marked as unused
 * @author Glen Mailer
 */
'use strict';

const pragmaUtil = require('../util/pragma');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent Inferno to be marked as unused',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-uses-inferno')
    },
    schema: []
  },

  create: function(context) {
    const pragma = pragmaUtil.getFromContext(context);

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      JSXOpeningElement: function() {
        context.markVariableAsUsed(pragma);
      }

    };
  }
};
