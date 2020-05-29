/**
 * @fileoverview Prevent common casing typos
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const STATIC_CLASS_PROPERTIES = ['defaultProps'];
const STATIC_LIFECYCLE_METHODS = ['getDerivedStateFromProps'];
const LIFECYCLE_METHODS = [
  'getDerivedStateFromProps',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'render'
];

module.exports = {
  meta: {
    docs: {
      description: 'Prevent common typos',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('no-typos')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => {
    function reportErrorIfPropertyCasingTypo(propertyValue, propertyKey, isClassProperty) {
      const propertyName = propertyKey.name;
      STATIC_CLASS_PROPERTIES.forEach((CLASS_PROP) => {
        if (propertyName && CLASS_PROP.toLowerCase() === propertyName.toLowerCase() && CLASS_PROP !== propertyName) {
          const message = isClassProperty
            ? 'Typo in static class property declaration'
            : 'Typo in property declaration';
          context.report({
            node: propertyKey,
            message
          });
        }
      });
    }

    function reportErrorIfLifecycleMethodCasingTypo(node) {
      let nodeKeyName = node.key.name;
      if (node.key.type === 'Literal') {
        nodeKeyName = node.key.value;
      }

      STATIC_LIFECYCLE_METHODS.forEach((method) => {
        if (!node.static && nodeKeyName.toLowerCase() === method.toLowerCase()) {
          context.report({
            node,
            message: `Lifecycle method should be static: ${nodeKeyName}`
          });
        }
      });

      LIFECYCLE_METHODS.forEach((method) => {
        if (method.toLowerCase() === nodeKeyName.toLowerCase() && method !== nodeKeyName) {
          context.report({
            node,
            message: 'Typo in component lifecycle method declaration: {{actual}} should be {{expected}}',
            data: {actual: nodeKeyName, expected: method}
          });
        }
      });
    }

    return {

      ClassProperty(node) {
        if (!node.static || !utils.isES6Component(node.parent.parent)) {
          return;
        }

        reportErrorIfPropertyCasingTypo(node.value, node.key, true);
      },

      MemberExpression(node) {
        const propertyName = node.property.name;

        if (
          !propertyName
          || STATIC_CLASS_PROPERTIES.map((prop) => prop.toLocaleLowerCase()).indexOf(propertyName.toLowerCase()) === -1
        ) {
          return;
        }

        const relatedComponent = utils.getRelatedComponent(node);

        if (
          relatedComponent
          && (utils.isES6Component(relatedComponent.node) || utils.isReturningJSX(relatedComponent.node))
          && (node.parent && node.parent.type === 'AssignmentExpression' && node.parent.right)
        ) {
          reportErrorIfPropertyCasingTypo(node.parent.right, node.property, true);
        }
      },

      MethodDefinition(node) {
        if (!utils.isES6Component(node.parent.parent)) {
          return;
        }

        reportErrorIfLifecycleMethodCasingTypo(node);
      },

      ObjectExpression(node) {
        const component = utils.isES5Component(node) && components.get(node);

        if (!component) {
          return;
        }

        node.properties.forEach((property) => {
          reportErrorIfPropertyCasingTypo(property.value, property.key, false);
          reportErrorIfLifecycleMethodCasingTypo(property);
        });
      }
    };
  })
};
