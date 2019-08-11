/**
 * @fileoverview Enforce shorthand or standard form for Inferno fragments.
 * @author Alex Zherdev
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');
const pragmaUtil = require('../util/pragma');
const variableUtil = require('../util/variable');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replaceNode(source, node, text) {
  return `${source.slice(0, node.range[0])}${text}${source.slice(node.range[1])}`;
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce shorthand or standard form for Inferno fragments',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-fragments')
    },
    fixable: 'code',

    schema: [{
      enum: ['syntax', 'element']
    }]
  },

  create(context) {
    const configuration = context.options[0] || 'syntax';
    const infernoPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);
    const openFragShort = '<>';
    const closeFragShort = '</>';
    const openFragLong = `<${infernoPragma}.${fragmentPragma}>`;
    const closeFragLong = `</${infernoPragma}.${fragmentPragma}>`;

    function getFixerToLong(jsxFragment) {
      const sourceCode = context.getSourceCode();
      return function (fixer) {
        let source = sourceCode.getText();
        source = replaceNode(source, jsxFragment.closingFragment, closeFragLong);
        source = replaceNode(source, jsxFragment.openingFragment, openFragLong);
        const lengthDiff = openFragLong.length - sourceCode.getText(jsxFragment.openingFragment).length +
          closeFragLong.length - sourceCode.getText(jsxFragment.closingFragment).length;
        const range = jsxFragment.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] + lengthDiff));
      };
    }

    function getFixerToShort(jsxElement) {
      const sourceCode = context.getSourceCode();
      return function (fixer) {
        let source = sourceCode.getText();
        let lengthDiff;
        if (jsxElement.closingElement) {
          source = replaceNode(source, jsxElement.closingElement, closeFragShort);
          source = replaceNode(source, jsxElement.openingElement, openFragShort);
          lengthDiff = sourceCode.getText(jsxElement.openingElement).length - openFragShort.length +
            sourceCode.getText(jsxElement.closingElement).length - closeFragShort.length;
        } else {
          source = replaceNode(source, jsxElement.openingElement, `${openFragShort}${closeFragShort}`);
          lengthDiff = sourceCode.getText(jsxElement.openingElement).length - openFragShort.length -
            closeFragShort.length;
        }

        const range = jsxElement.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] - lengthDiff));
      };
    }

    function refersToInfernoFragment(name) {
      const variableInit = variableUtil.findVariableByName(context, name);
      if (!variableInit) {
        return false;
      }

      // const { Fragment } = Inferno;
      if (variableInit.type === 'Identifier' && variableInit.name === infernoPragma) {
        return true;
      }

      // const Fragment = Inferno.Fragment;
      if (
        variableInit.type === 'MemberExpression' &&
        variableInit.object.type === 'Identifier' &&
        variableInit.object.name === infernoPragma &&
        variableInit.property.type === 'Identifier' &&
        variableInit.property.name === fragmentPragma
      ) {
        return true;
      }

      // const { Fragment } = require('inferno');
      if (
        variableInit.callee &&
        variableInit.callee.name === 'require' &&
        variableInit.arguments &&
        variableInit.arguments[0] &&
        variableInit.arguments[0].value === 'inferno'
      ) {
        return true;
      }

      return false;
    }

    const jsxElements = [];
    const fragmentNames = new Set([`${infernoPragma}.${fragmentPragma}`]);

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXElement(node) {
        jsxElements.push(node);
      },

      JSXFragment(node) {
        if (configuration === 'element') {
          context.report({
            node,
            message: `Prefer ${infernoPragma}.${fragmentPragma} over fragment shorthand`,
            fix: getFixerToLong(node)
          });
        }
      },

      ImportDeclaration(node) {
        if (node.source && node.source.value === 'inferno') {
          node.specifiers.forEach((spec) => {
            if (spec.imported && spec.imported.name === fragmentPragma) {
              if (spec.local) {
                fragmentNames.add(spec.local.name);
              }
            }
          });
        }
      },

      'Program:exit': function () {
        jsxElements.forEach((node) => {
          const openingEl = node.openingElement;
          const elName = elementType(openingEl);

          if (fragmentNames.has(elName) || refersToInfernoFragment(elName)) {
            const attrs = openingEl.attributes;
            if (configuration === 'syntax' && !(attrs && attrs.length > 0)) {
              context.report({
                node,
                message: `Prefer fragment shorthand over ${infernoPragma}.${fragmentPragma}`,
                fix: getFixerToShort(node)
              });
            }
          }
        });
      }
    };
  }
};
