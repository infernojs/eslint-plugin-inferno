/**
 * @fileoverview Prevent usage of deprecated methods
 * @author Yannick Croissant
 * @author Scott Feeney
 */
'use strict';

var pragmaUtil = require('../util/pragma');
var versionUtil = require('../util/version');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var DEPRECATED_MESSAGE = '{{oldMethod}} is deprecated since Inferno {{version}}{{newMethod}}';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of deprecated methods',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {

    var sourceCode = context.getSourceCode();
    var pragma = pragmaUtil.getFromContext(context);

    function getDeprecated() {
      var deprecated = {
        MemberExpression: {}
      };

      return deprecated;
    }

    function isDeprecated(type, method) {
      var deprecated = getDeprecated();

      return (
        deprecated[type] &&
        deprecated[type][method] &&
        versionUtil.test(context, deprecated[type][method][0])
      );
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      MemberExpression: function(node) {
        var method = sourceCode.getText(node);
        if (!isDeprecated(node.type, method)) {
          return;
        }
        var deprecated = getDeprecated();
        context.report({
          node: node,
          message: DEPRECATED_MESSAGE,
          data: {
            oldMethod: method,
            version: deprecated[node.type][method][0],
            newMethod: deprecated[node.type][method][1] ? ', use ' + deprecated[node.type][method][1] + ' instead' : ''
          }
        });
      },

      BlockComment: function(node) {
        pragma = pragmaUtil.getFromNode(node) || pragma;
      }

    };

  }
};
