/**
 * @fileoverview Enforce shorthand or standard form for Inferno fragments.
 * @author Alex Zherdev
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');
const pragmaUtil = require('../util/pragma');
const variableUtil = require('../util/variable');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const getText = require('../util/eslint').getText;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replaceNode(source, node, text) {
  return `${source.slice(0, node.range[0])}${text}${source.slice(node.range[1])}`;
}

const messages = {
  fragmentsNotSupported: 'Fragments are only supported starting from Inferno v6. '
    + 'Please disable the `inferno/jsx-fragments` rule in `eslint` settings or upgrade your version of Inferno.',
  preferPragma: 'Prefer {{inferno}}.{{fragment}} over fragment shorthand',
  preferFragment: 'Prefer fragment shorthand over {{inferno}}.{{fragment}}',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Enforce shorthand or standard form for Inferno fragments',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-fragments'),
    },
    fixable: 'code',
    messages,
    schema: [{
      enum: ['syntax', 'element'],
    }],
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
      if (!jsxFragment.closingFragment || !jsxFragment.openingFragment) {
        // the old TS parser crashes here
        // TODO: FIXME: can we fake these two descriptors?
        return null;
      }
      return function fix(fixer) {
        let source = getText(context);
        source = replaceNode(source, jsxFragment.closingFragment, closeFragLong);
        source = replaceNode(source, jsxFragment.openingFragment, openFragLong);
        const lengthDiff = openFragLong.length - getText(context, jsxFragment.openingFragment).length
          + closeFragLong.length - getText(context, jsxFragment.closingFragment).length;
        const range = jsxFragment.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] + lengthDiff));
      };
    }

    function getFixerToShort(jsxElement) {
      return function fix(fixer) {
        let source = getText(context);
        let lengthDiff;
        if (jsxElement.closingElement) {
          source = replaceNode(source, jsxElement.closingElement, closeFragShort);
          source = replaceNode(source, jsxElement.openingElement, openFragShort);
          lengthDiff = getText(context, jsxElement.openingElement).length - openFragShort.length
            + getText(context, jsxElement.closingElement).length - closeFragShort.length;
        } else {
          source = replaceNode(source, jsxElement.openingElement, `${openFragShort}${closeFragShort}`);
          lengthDiff = getText(context, jsxElement.openingElement).length - openFragShort.length
            - closeFragShort.length;
        }

        const range = jsxElement.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] - lengthDiff));
      };
    }

    function refersToInfernoFragment(node, name) {
      const variableInit = variableUtil.findVariableByName(context, node, name);
      if (!variableInit) {
        return false;
      }

      // const { Fragment } = Inferno;
      if (variableInit.type === 'Identifier' && variableInit.name === infernoPragma) {
        return true;
      }

      // const Fragment = Inferno.Fragment;
      if (
        variableInit.type === 'MemberExpression'
        && variableInit.object.type === 'Identifier'
        && variableInit.object.name === infernoPragma
        && variableInit.property.type === 'Identifier'
        && variableInit.property.name === fragmentPragma
      ) {
        return true;
      }

      // const { Fragment } = require('inferno');
      if (
        variableInit.callee
        && variableInit.callee.name === 'require'
        && variableInit.arguments
        && variableInit.arguments[0]
        && variableInit.arguments[0].value === 'inferno'
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
          report(context, messages.preferPragma, 'preferPragma', {
            node,
            data: {
              inferno: infernoPragma,
              fragment: fragmentPragma,
            },
            fix: getFixerToLong(node),
          });
        }
      },

      ImportDeclaration(node) {
        if (node.source && node.source.value === 'inferno') {
          node.specifiers.forEach((spec) => {
            if (
              'imported' in spec
              && spec.imported
              && 'name' in spec.imported
              && spec.imported.name === fragmentPragma
            ) {
              if (spec.local) {
                fragmentNames.add(spec.local.name);
              }
            }
          });
        }
      },

      'Program:exit'() {
        jsxElements.forEach((node) => {
          const openingEl = node.openingElement;
          const elName = elementType(openingEl);

          if (fragmentNames.has(elName) || refersToInfernoFragment(node, elName)) {
            const attrs = openingEl.attributes;
            if (configuration === 'syntax' && !(attrs && attrs.length > 0)) {
              report(context, messages.preferFragment, 'preferFragment', {
                node,
                data: {
                  inferno: infernoPragma,
                  fragment: fragmentPragma,
                },
                fix: getFixerToShort(node),
              });
            }
          }
        });
      },
    };
  },
};
