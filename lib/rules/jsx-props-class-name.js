/**
 * @fileoverview Enforce 'class' or 'className' Attributes
 * @author Bernhard Reisenberger
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const OPTIONS = {
  className: {
    convert(str) {
      return str.replace(/class\b/gu, 'className');
    },
  },
  class: {
    convert(str) {
      return str.replace(/className\b/gu, 'class');
    },
  },
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce \'class\' or \'className\' attributes',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-props-class-name'),
    },
    fixable: 'code',
    schema: [{
      enum: ['className', 'class'],
    }],
  },

  create(context) {
    const option = context.options[0] || 'className';

    return {
      JSXAttribute(node) {
        const attributeName = node.name.name;

        if (attributeName !== 'className' && attributeName !== 'class') {
          return; // skip other attributes
        }

        // Components receive `class` and `className` as different props
        if (!jsxUtil.isDOMComponent(node.parent)) {
          return;
        }

        if (attributeName !== option) {
          // Renaming would duplicate an attribute that is already present
          const hasOption = node.parent.attributes.some(
            (attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === option,
          );

          context.report({
            node,
            message: `Invalid attribute '${attributeName}' found, use '${option}' instead`,
            fix: hasOption ? null : (fixer) => fixer.replaceText(node.name, OPTIONS[option].convert(attributeName)),
          });
        }
      },
    };
  },
};
