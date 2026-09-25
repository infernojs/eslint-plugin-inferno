/**
 * @fileoverview Lifecycle methods should be methods on the prototype, not class fields
 * @author Tan Nguyen
 */

'use strict';

const Components = require('../util/Components');
const astUtil = require('../util/ast');
const componentUtil = require('../util/componentUtil');
const docsUrl = require('../util/docsUrl');
const lifecycleMethods = require('../util/lifecycleMethods');
const report = require('../util/report');
const eslintUtil = require('../util/eslint');

const getSourceCode = eslintUtil.getSourceCode;
const getText = eslintUtil.getText;

function isClassProperty(node) {
  return node.type === 'ClassProperty' || node.type === 'PropertyDefinition';
}

function getRuleText(context, node) {
  const params = node.value.params;
  // Keep the original source so destructuring, defaults and type annotations survive
  const paramsText = params.length > 0
    ? getSourceCode(context).text.slice(params[0].range[0], params[params.length - 1].range[1])
    : '';

  if (node.type === 'Property') {
    return `: ${node.value.async ? 'async ' : ''}function(${paramsText}) `;
  }

  if (isClassProperty(node)) {
    return `(${paramsText}) `;
  }

  return null;
}

const messages = {
  lifecycle: '{{propertyName}} is a Inferno lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Lifecycle methods should be methods on the prototype, not class fields',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-arrow-function-lifecycle'),
    },
    messages,
    schema: [],
    fixable: 'code',
  },

  create: Components.detect((context, components) => {
    /**
     * @param {Array} properties list of component properties
     */
    function reportNoArrowFunctionLifecycle(properties) {
      properties.forEach((node) => {
        if (!node || !node.value) {
          return;
        }

        const propertyName = astUtil.getPropertyName(node);
        const nodeType = node.value.type;
        const isLifecycleMethod = (
          node.static && !componentUtil.isES5Component(node, context)
            ? lifecycleMethods.static
            : lifecycleMethods.instance
        ).indexOf(propertyName) > -1;

        if (nodeType === 'ArrowFunctionExpression' && isLifecycleMethod) {
          const body = node.value.body;
          const isBlockBody = body.type === 'BlockStatement';
          const sourceCode = getSourceCode(context);

          let nextComment = [];
          let previousComment = [];
          let bodyRange;
          if (!isBlockBody) {
            const previousToken = sourceCode.getTokenBefore(body);

            if (sourceCode.getCommentsBefore) {
              // eslint >=4.x
              previousComment = sourceCode.getCommentsBefore(body);
            } else {
              // eslint 3.x
              const potentialComment = sourceCode.getTokenBefore(body, { includeComments: true });
              previousComment = previousToken === potentialComment ? [] : [potentialComment];
            }

            if (sourceCode.getCommentsAfter) {
              // eslint >=4.x
              nextComment = sourceCode.getCommentsAfter(body);
            } else {
              // eslint 3.x
              const potentialComment = sourceCode.getTokenAfter(body, { includeComments: true });
              const nextToken = sourceCode.getTokenAfter(body);
              nextComment = nextToken === potentialComment ? [] : [potentialComment];
            }
            bodyRange = [
              (previousComment.length > 0 ? previousComment[0] : body).range[0],
              (nextComment.length > 0 ? nextComment[nextComment.length - 1] : body).range[1]
                + (node.value.body.type === 'ObjectExpression' ? 1 : 0), // to account for a wrapped end paren
            ];
          }
          const headRange = [
            node.key.range[1],
            (previousComment.length > 0 ? previousComment[0] : body).range[0],
          ];
          const hasSemi = node.value.expression && getText(context, node).slice(node.value.range[1] - node.range[0]) === ';';

          report(
            context,
            messages.lifecycle,
            'lifecycle',
            {
              node,
              data: {
                propertyName,
              },
              fix(fixer) {
                if (!sourceCode.getCommentsAfter) {
                  // eslint 3.x
                  return isBlockBody && fixer.replaceTextRange(headRange, getRuleText(context, node));
                }
                return [].concat(
                  // An async class method needs the `async` keyword before its name
                  node.value.async && isClassProperty(node) ? fixer.insertTextBefore(node.key, 'async ') : [],
                  fixer.replaceTextRange(headRange, getRuleText(context, node)),
                  isBlockBody ? [] : fixer.replaceTextRange(
                    [bodyRange[0], bodyRange[1] + (hasSemi ? 1 : 0)],
                    `{ return ${previousComment.map((x) => getText(context, x)).join('')}${getText(context, body)}${nextComment.map((x) => getText(context, x)).join('')}; }`,
                  ),
                );
              },
            },
          );
        }
      });
    }

    return {
      'Program:exit'() {
        Object.values(components.list()).forEach((component) => {
          const properties = astUtil.getComponentProperties(component.node);
          reportNoArrowFunctionLifecycle(properties);
        });
      },
    };
  }),
};
