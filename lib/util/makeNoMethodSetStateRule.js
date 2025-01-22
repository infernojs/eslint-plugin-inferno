/**
 * @fileoverview Prevent usage of setState in lifecycle methods
 * @author Yannick Croissant
 */

'use strict';

const docsUrl = require('./docsUrl');
const report = require('./report');
const getAncestors = require('./eslint').getAncestors;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function mapTitle(methodName) {
  const map = {
    componentDidMount: 'did-mount',
    componentDidUpdate: 'did-update',
    componentWillUpdate: 'will-update',
  };
  const title = map[methodName];
  if (!title) {
    throw Error(`No docsUrl for '${methodName}'`);
  }
  return `no-${title}-set-state`;
}

const messages = {
  noSetState: 'Do not use setState in {{name}}',
};

// eslint-disable-next-line
module.exports = function makeNoMethodSetStateRule(methodName) {
// eslint-disable-next-line valid-jsdoc
/**
 * @param {string} methodName
 * @param {(context: import('eslint').Rule.RuleContext) => boolean} [shouldCheckUnsafeCb]
 * @returns {import('eslint').Rule.RuleModule}
 */
  return {
    meta: {
      docs: {
        description: `Disallow usage of setState in ${methodName}`,
        category: 'Best Practices',
        recommended: false,
        url: docsUrl(mapTitle(methodName)),
      },

      messages,

      schema: [{
        enum: ['disallow-in-func'],
      }],
    },

    create(context) {
      const mode = context.options[0] || 'allow-in-func';

      function nameMatches(name) {
        return name === methodName;
      }

      // --------------------------------------------------------------------------
      // Public
      // --------------------------------------------------------------------------

      return {
        CallExpression(node) {
          const callee = node.callee;
          if (
            callee.type !== 'MemberExpression'
            || callee.object.type !== 'ThisExpression'
            || !('name' in callee.property)
            || callee.property.name !== 'setState'
          ) {
            return;
          }
          const ancestors = getAncestors(context, node);
          let depth = 0;
          ancestors.findLast((ancestor) => {
          // ancestors.some((ancestor) => {
            if (/Function(Expression|Declaration)$/.test(ancestor.type)) {
              depth += 1;
            }
            if (
              (ancestor.type !== 'Property' && ancestor.type !== 'MethodDefinition' && ancestor.type !== 'ClassProperty' && ancestor.type !== 'PropertyDefinition')
              || !nameMatches(ancestor.key.name)
              || (mode !== 'disallow-in-func' && depth > 1)
            ) {
              return false;
            }
            report(context, messages.noSetState, 'noSetState', {
              node: callee,
              data: {
                name: ancestor.key.name,
              },
            });
            return true;
          });
        },
      };
    },
  };
};
