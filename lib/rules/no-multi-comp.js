/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent multiple component definition per file',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-multi-comp')
    },

    schema: [{
      type: 'object',
      properties: {
        ignoreStateless: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || {};
    const ignoreStateless = configuration.ignoreStateless || false;

    const MULTI_COMP_MESSAGE = 'Declare only one Inferno component per file';

    /**
     * Checks if the component is ignored
     * @param {Object} component The component being checked.
     * @returns {Boolean} True if the component is ignored, false if not.
     */
    function isIgnored(component) {
      return (
        ignoreStateless && (
          /Function/.test(component.node.type) ||
          utils.isPragmaComponentWrapper(component.node)
        )
      );
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      'Program:exit': function () {
        if (components.length() <= 1) {
          return;
        }

        const list = components.list();
        let relevantComponentCount = 0;

        for (let i = 0; i < list.length; i++) {
          const component = list[i];

          if (!isIgnored(component)) {
            if (relevantComponentCount > 0) {
              context.report({
                node: component.node,
                message: MULTI_COMP_MESSAGE
              });
            }
            relevantComponentCount++;
          }
        }
      }
    };
  })
};
