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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids -- https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/issues/292
  meta: {
    docs: {
      description: 'Disallow Inferno to be incorrectly marked as unused',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-uses-inferno'),
    },
    schema: [],
  },

  create(context) {
    const pragma = pragmaUtil.getFromContext(context);
    const fragment = pragmaUtil.getFragmentFromContext(context);

    function handleOpeningElement() {
      context.markVariableAsUsed(pragma);
    }
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement: handleOpeningElement,
      JSXOpeningFragment: handleOpeningElement,
      JSXFragment() {
        context.markVariableAsUsed(fragment);
      },
    };
  },
};
