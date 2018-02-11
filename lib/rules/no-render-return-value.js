/**
 * @fileoverview Prevent usage of the return value of Inferno.render
 * @author Dustan Kasten
 */
'use strict';

const docsUrl = require('../util/docsUrl');
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of the return value of Inferno.render',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-render-return-value')
    },
    schema: []
  },

  create: function(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      CallExpression: function(node) {
        const callee = node.callee;
        const parent = node.parent;
        if (callee.type !== 'MemberExpression') {
          return;
        }
        const calleeObjectName = /^Inferno$/;

        if (
          callee.object.type !== 'Identifier' ||
          !calleeObjectName.test(callee.object.name) ||
          callee.property.name !== 'render'
        ) {
          return;
        }

        if (
          parent.type === 'VariableDeclarator' ||
          parent.type === 'Property' ||
          parent.type === 'ReturnStatement' ||
          parent.type === 'ArrowFunctionExpression'
        ) {
          context.report({
            node: callee,
            message: `Do not depend on the return value from ${callee.object.name}.render`
          });
        }
      }
    };
  }
};
