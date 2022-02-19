/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

const hasProp = require('jsx-ast-utils/hasProp');
const propName = require('jsx-ast-utils/propName');
const docsUrl = require('../util/docsUrl');
const pragmaUtil = require('../util/pragma');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const defaultOptions = {
  checkFragmentShorthand: false,
  checkKeyMustBeforeSpread: false,
};

const messages = {
  missingIterKey: 'Missing "key" prop for element in iterator',
  missingIterKeyUsePrag: 'Missing "key" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{infernoPrag}}.{{fragPrag}} instead',
  missingArrayKey: 'Missing "key" prop for element in array',
  missingArrayKeyUsePrag: 'Missing "key" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{infernoPrag}}.{{fragPrag}} instead',
  keyBeforeSpread: '`key` prop must be placed before any `{...spread}, to avoid conflicting with Inferno’s JSX transform',
};

module.exports = {
  meta: {
    docs: {
      description: 'Report missing `key` props in iterators/collection literals',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-key'),
    },

    messages,

    schema: [{
      type: 'object',
      properties: {
        checkFragmentShorthand: {
          type: 'boolean',
          default: defaultOptions.checkFragmentShorthand,
        },
        checkKeyMustBeforeSpread: {
          type: 'boolean',
          default: defaultOptions.checkKeyMustBeforeSpread,
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const options = Object.assign({}, defaultOptions, context.options[0]);
    const checkFragmentShorthand = options.checkFragmentShorthand;
    const checkKeyMustBeforeSpread = options.checkKeyMustBeforeSpread;
    const infernoPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);

    function checkIteratorElement(node) {
      if (node.type === 'JSXElement' && !hasProp(node.openingElement.attributes, 'key')) {
        report(context, messages.missingIterKey, 'missingIterKey', {
          node,
        });
      } else if (checkFragmentShorthand && node.type === 'JSXFragment') {
        report(context, messages.missingIterKeyUsePrag, 'missingIterKeyUsePrag', {
          node,
          data: {
            infernoPrag: infernoPragma,
            fragPrag: fragmentPragma,
          },
        });
      }
    }

    function getReturnStatement(body) {
      return body.filter((item) => item.type === 'ReturnStatement')[0];
    }

    function isKeyAfterSpread(attributes) {
      let hasFoundSpread = false;
      return attributes.some((attribute) => {
        if (attribute.type === 'JSXSpreadAttribute') {
          hasFoundSpread = true;
          return false;
        }
        if (attribute.type !== 'JSXAttribute') {
          return false;
        }
        return hasFoundSpread && propName(attribute) === 'key';
      });
    }

    return {
      JSXElement(node) {
        if (hasProp(node.openingElement.attributes, 'key')) {
          if (checkKeyMustBeforeSpread && isKeyAfterSpread(node.openingElement.attributes)) {
            report(context, messages.keyBeforeSpread, 'keyBeforeSpread', {
              node,
            });
          }
          return;
        }

        if (node.parent.type === 'ArrayExpression') {
          report(context, messages.missingArrayKey, 'missingArrayKey', {
            node,
          });
        }
      },

      JSXFragment(node) {
        if (!checkFragmentShorthand) {
          return;
        }

        if (node.parent.type === 'ArrayExpression') {
          report(context, messages.missingArrayKeyUsePrag, 'missingArrayKeyUsePrag', {
            node,
            data: {
              infernoPrag: infernoPragma,
              fragPrag: fragmentPragma,
            },
          });
        }
      },

      // Array.prototype.map
      'CallExpression, OptionalCallExpression'(node) {
        if (node.callee && node.callee.type !== 'MemberExpression' && node.callee.type !== 'OptionalMemberExpression') {
          return;
        }

        if (node.callee && node.callee.property && node.callee.property.name !== 'map') {
          return;
        }

        const fn = node.arguments[0];
        const isFn = fn && fn.type === 'FunctionExpression';
        const isArrFn = fn && fn.type === 'ArrowFunctionExpression';

        if (isArrFn && (fn.body.type === 'JSXElement' || fn.body.type === 'JSXFragment')) {
          checkIteratorElement(fn.body);
        }

        if (isFn || isArrFn) {
          if (fn.body.type === 'BlockStatement') {
            const returnStatement = getReturnStatement(fn.body.body);
            if (returnStatement && returnStatement.argument) {
              checkIteratorElement(returnStatement.argument);
            }
          }
        }
      },
    };
  },
};
