/**
 * @fileoverview Enforce 'class' or 'className' Attributes
 * @author Bernhard Reisenberger
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const OPTIONS = {
  className: {
    convert(str) {
      return str.replace(/class\b/gu, 'className');
    }
  },
  class: {
    convert(str) {
      return str.replace(/className\b/gu, 'class');
    }
  }
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce \'class\' or \'className\' attributes',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-props-class-name')
    },
    fixable: 'code',
    schema: [{
      enum: ['className', 'class']
    }]
  },

  create(context) {
    const option = context.options[0] || 'className';

    return {
      JSXAttribute(node) {
        const attributeName = node.name.name;

        if (attributeName !== 'className' && attributeName !== 'class') {
          return; // skip other attributes
        }

        if (attributeName !== option) {
          context.report({
            node,
            message: `Invalid attribute '${attributeName}' found, use '${option}' instead`,
            fix(fixer) {
              return fixer.replaceText(node.name, OPTIONS[option].convert(attributeName));
            }
          });
        }
      }
    };
  }
};
