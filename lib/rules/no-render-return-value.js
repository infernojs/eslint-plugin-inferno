/**
 * @fileoverview Prevent usage of the return value of Inferno.render
 * @author Dustan Kasten
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noReturnValue: 'Do not depend on the return value from {{node}}.render',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of the return value of Inferno.render',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-render-return-value'),
    },

    messages,

    schema: [],
  },

  create(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    const calleeObjectName = /^Inferno$/;

    return {
      CallExpression(node) {
        const callee = node.callee;
        const parent = node.parent;
        if (callee.type !== 'MemberExpression') {
          return;
        }

        if (
          callee.object.type !== 'Identifier'
          || !calleeObjectName.test(callee.object.name)
          || (!('name' in callee.property) || callee.property.name !== 'render')
        ) {
          return;
        }

        if (
          parent.type === 'VariableDeclarator'
          || parent.type === 'Property'
          || parent.type === 'ReturnStatement'
          || parent.type === 'ArrowFunctionExpression'
          || parent.type === 'AssignmentExpression'
        ) {
          report(context, messages.noReturnValue, 'noReturnValue', {
            node: callee,
            data: {
              node: callee.object.name,
            },
          });
        }
      },
    };
  },
};
