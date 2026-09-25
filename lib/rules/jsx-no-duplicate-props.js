/**
 * @fileoverview Enforce no duplicate props
 * @author Markus Ånöstam
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

// Props that Inferno treats as the same prop on DOM elements
const DOM_PROP_ALIASES = {
  className: 'class',
  htmlFor: 'for',
  onDoubleClick: 'onDblClick',
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noDuplicateProps: 'No duplicate props allowed',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow duplicate properties in JSX',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-no-duplicate-props'),
    },

    messages,

    schema: [{
      type: 'object',
      properties: {
        ignoreCase: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    const configuration = context.options[0] || {};
    const ignoreCase = configuration.ignoreCase || false;

    return {
      JSXOpeningElement(node) {
        const props = {};
        const isDOMComponent = jsxUtil.isDOMComponent(node);

        node.attributes.forEach((decl) => {
          if (decl.type === 'JSXSpreadAttribute') {
            return;
          }

          let name = decl.name.name;

          if (typeof name !== 'string') {
            return;
          }

          if (isDOMComponent && Object.hasOwn(DOM_PROP_ALIASES, name)) {
            name = DOM_PROP_ALIASES[name];
          }

          if (ignoreCase) {
            name = name.toLowerCase();
          }

          if (Object.hasOwn(props, name)) {
            report(context, messages.noDuplicateProps, 'noDuplicateProps', {
              node: decl,
            });
          } else {
            props[name] = 1;
          }
        });
      },
    };
  },
};
