/**
 * @fileoverview Utility class and functions for Inferno components detection
 * @author Yannick Croissant
 */

'use strict';

const iterFrom = require('es-iterator-helpers/Iterator.from');
const map = require('es-iterator-helpers/Iterator.prototype.map');
const variableUtil = require('./variable');
const pragmaUtil = require('./pragma');
const astUtil = require('./ast');
const componentUtil = require('./componentUtil');
const jsxUtil = require('./jsx');
const defaultPropsUtil = require('./defaultProps');
const isFirstLetterCapitalized = require('./isFirstLetterCapitalized');
const isDestructuredFromPragmaImport = require('./isDestructuredFromPragmaImport');
const eslintUtil = require('./eslint');

const getScope = eslintUtil.getScope;
const getText = eslintUtil.getText;

function getId(node) {
  return node ? `${node.range[0]}:${node.range[1]}` : '';
}

const LISTS = new WeakMap();
const InfernoImports = new WeakMap();
/**
 * Components
 */
class Components {
  constructor() {
    LISTS.set(this, new Map());
    InfernoImports.set(this, {});
  }

  /**
   * Add a node to the components list, or update it if it's already in the list
   *
   * @param {ASTNode} node The AST node being added.
   * @param {number} confidence Confidence in the component detection (0=banned, 1=maybe, 2=yes)
   * @returns {Object} Added component object
   */
  add(node, confidence) {
    const id = getId(node);
    const list = LISTS.get(this);
    let listItem = list.get(id);

    if (listItem) {
      if (confidence === 0 || listItem.confidence === 0) {
        listItem.confidence = 0;
      } else {
        listItem.confidence = Math.max(listItem.confidence, confidence);
      }
    } else {
      listItem = {
        node,
        confidence,
      };
      list.set(id, listItem);
    }

    return listItem;
  }

  /**
   * Find a component in the list using its node
   *
   * @param {ASTNode} node The AST node being searched.
   * @returns {Object} Component object, undefined if the component is not found or has confidence value of 0.
   */
  get(node) {
    const id = getId(node);
    const item = LISTS.get(this).get(id);
    if (item && item.confidence >= 1) {
      return item;
    }
    return null;
  }

  /**
   * Update a component in the list
   *
   * @param {ASTNode} node The AST node being updated.
   * @param {Object} props Additional properties to add to the component.
   */
  set(node, props) {
    const list = LISTS.get(this);
    let component = list.get(getId(node));
    while (!component || component.confidence < 1) {
      node = node.parent;
      if (!node) {
        return;
      }
      component = list.get(getId(node));
    }

    Object.assign(
      component,
      props,
    );
  }

  /**
   * Return the components list
   * Components for which we are not confident are not returned
   *
   * @returns {Object} Components list
   */
  list() {
    const thisList = LISTS.get(this);
    const list = [];

    // Find props used in components for which we are not confident
    thisList.forEach((thisComponent) => {
      if (thisComponent.confidence >= 2) {
        list.push(thisComponent);
      }
    });

    return list;
  }

  /**
   * Return the length of the components list
   * Components for which we are not confident are not counted
   *
   * @returns {number} Components list length
   */
  length() {
    const list = LISTS.get(this);
    let counter = 0;

    list.forEach((component) => {
      if (component.confidence >= 2) {
        counter++;
      }
    });

    return counter;
  }

  /**
   * Return the node naming the default Inferno import
   * It can be used to determine the local name of import, even if it's imported
   * with an unusual name.
   *
   * @returns {ASTNode} Inferno default import node
   */
  getDefaultInfernoImports() {
    return InfernoImports.get(this).defaultInfernoImports;
  }

  /**
   * Return the nodes of all Inferno named imports
   *
   * @returns {Object} The list of Inferno named imports
   */
  getNamedInfernoImports() {
    return InfernoImports.get(this).namedInfernoImports;
  }

  /**
   * Add the default Inferno import specifier to the scope
   *
   * @param {ASTNode} specifier The AST Node of the default Inferno import
   * @returns {void}
   */
  addDefaultInfernoImport(specifier) {
    const info = InfernoImports.get(this);
    InfernoImports.set(this, { ...info, defaultInfernoImports: (info.defaultInfernoImports || []).concat(specifier) });
  }

  /**
   * Add a named Inferno import specifier to the scope
   *
   * @param {ASTNode} specifier The AST Node of a named Inferno import
   * @returns {void}
   */
  addNamedInfernoImport(specifier) {
    const info = InfernoImports.get(this);
    InfernoImports.set(this, { ...info, namedInfernoImports: (info.namedInfernoImports || []).concat(specifier) });
  }
}

function getWrapperFunctions(context, pragma) {
  const componentWrapperFunctions = context.settings.componentWrapperFunctions || [];

  // eslint-disable-next-line arrow-body-style
  return componentWrapperFunctions.map((wrapperFunction) => {
    return typeof wrapperFunction === 'string'
      ? { property: wrapperFunction }
      : ({ ...wrapperFunction, object: wrapperFunction.object === '<pragma>' ? pragma : wrapperFunction.object });
  }).concat([
    { property: 'forwardRef', object: pragma },
    { property: 'memo', object: pragma },
  ]);
}

// eslint-disable-next-line valid-jsdoc
/**
 * Merge many eslint rules into one
 * @param {{[_: string]: Function}[]} rules the returned values for eslint rule.create(context)
 * @returns {{[_: string]: Function}} merged rule
 */
function mergeRules(rules) {
  /** @type {Map<string, Function[]>} */
  const handlersByKey = new Map();
  rules.forEach((rule) => {
    Object.keys(rule).forEach((key) => {
      const fns = handlersByKey.get(key);
      if (!fns) {
        handlersByKey.set(key, [rule[key]]);
      } else {
        fns.push(rule[key]);
      }
    });
  });

  /** @type {{ [key: string]: Function }} */
  return Object.fromEntries(map(iterFrom(handlersByKey), (entry) => [
    entry[0],
    function mergedHandler(node) {
      entry[1].forEach((fn) => {
        fn(node);
      });
    },
  ]));
}

function componentRule(rule, context) {
  const pragma = pragmaUtil.getFromContext(context);
  const components = new Components();
  const wrapperFunctions = getWrapperFunctions(context, pragma);

  // Utilities for component detection
  const utils = {
    /**
     * Check if variable is destructured from pragma import
     *
     * @param {ASTNode} node The AST node to check
     * @param {string} variable The variable name to check
     * @returns {boolean} True if createElement is destructured from the pragma
     */
    isDestructuredFromPragmaImport(node, variable) {
      return isDestructuredFromPragmaImport(context, node, variable);
    },

    /**
     * @param {ASTNode} node
     * @param {boolean=} strict
     * @returns {boolean}
     */
    isReturningJSX(node, strict) {
      return jsxUtil.isReturningJSX(context, node, strict, true);
    },

    isReturningJSXOrNull(node, strict) {
      return jsxUtil.isReturningJSX(context, node, strict);
    },

    isReturningOnlyNull(node) {
      return jsxUtil.isReturningOnlyNull(node, context);
    },

    getPragmaComponentWrapper(node) {
      let isPragmaComponentWrapper;
      let currentNode = node;
      let prevNode;
      do {
        currentNode = currentNode.parent;
        isPragmaComponentWrapper = this.isPragmaComponentWrapper(currentNode);
        if (isPragmaComponentWrapper) {
          prevNode = currentNode;
        }
      } while (isPragmaComponentWrapper);

      return prevNode;
    },

    getComponentNameFromJSXElement(node) {
      if (node.type !== 'JSXElement') {
        return null;
      }
      if (node.openingElement && node.openingElement.name && node.openingElement.name.name) {
        return node.openingElement.name.name;
      }
      return null;
    },

    /**
     * Getting the first JSX element's name.
     * @param {object} node
     * @returns {string | null}
     */
    getNameOfWrappedComponent(node) {
      if (node.length < 1) {
        return null;
      }
      const body = node[0].body;
      if (!body) {
        return null;
      }
      if (body.type === 'JSXElement') {
        return this.getComponentNameFromJSXElement(body);
      }
      if (body.type === 'BlockStatement') {
        const jsxElement = body.body.find((item) => item.type === 'ReturnStatement');
        return jsxElement
          && jsxElement.argument
          && this.getComponentNameFromJSXElement(jsxElement.argument);
      }
      return null;
    },

    getDetectedComponents() {
      const list = components.list();

      return Object.values(list).filter((val) => {
        if (val.node.type === 'ClassDeclaration') {
          return true;
        }
        if (
          val.node.type === 'ArrowFunctionExpression'
          && val.node.parent
          && val.node.parent.type === 'VariableDeclarator'
          && val.node.parent.id
        ) {
          return true;
        }
        return false;
      }).map((val) => {
        if (val.node.type === 'ArrowFunctionExpression') return val.node.parent.id.name;
        return val.node.id && val.node.id.name;
      });
    },

    /**
     * It will check whether memo/forwardRef is wrapping existing component or
     * creating a new one.
     * @param {object} node
     * @returns {boolean}
     */
    nodeWrapsComponent(node) {
      const childComponent = this.getNameOfWrappedComponent(node.arguments);
      const componentList = this.getDetectedComponents();
      return !!childComponent && componentList.includes(childComponent);
    },

    isPragmaComponentWrapper(node) {
      if (!astUtil.isCallExpression(node)) {
        return false;
      }

      return wrapperFunctions.some((wrapperFunction) => {
        if (node.callee.type === 'MemberExpression') {
          return wrapperFunction.object
            && wrapperFunction.object === node.callee.object.name
            && wrapperFunction.property === node.callee.property.name
            && !this.nodeWrapsComponent(node);
        }
        return wrapperFunction.property === node.callee.name
          && (!wrapperFunction.object
            // Functions coming from the current pragma need special handling
            || (wrapperFunction.object === pragma && this.isDestructuredFromPragmaImport(node, node.callee.name))
          );
      });
    },

    /**
     * Find a return statement in the current node
     *
     * @param {ASTNode} node The AST node being checked
     */
    findReturnStatement: astUtil.findReturnStatement,

    /**
     * Get the parent component node from the current scope
     * @param {ASTNode} node
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentComponent(node) {
      return (
        componentUtil.getParentES6Component(context, node)
        || componentUtil.getParentES5Component(context, node)
        || utils.getParentStatelessComponent(node)
      );
    },

    /**
     * @param {ASTNode} node
     * @returns {boolean}
     */
    isInAllowedPositionForComponent(node) {
      switch (node.parent.type) {
        case 'VariableDeclarator':
        case 'AssignmentExpression':
        case 'Property':
        case 'ReturnStatement':
        case 'ExportDefaultDeclaration':
        case 'ArrowFunctionExpression': {
          return true;
        }
        case 'SequenceExpression': {
          return utils.isInAllowedPositionForComponent(node.parent)
            && node === node.parent.expressions[node.parent.expressions.length - 1];
        }
        default:
          return false;
      }
    },

    /**
     * Get node if node is a stateless component, or node.parent in cases like
     * `Inferno.memo` or `Inferno.forwardRef`. Otherwise returns `undefined`.
     * @param {ASTNode} node
     * @returns {ASTNode | undefined}
     */
    getStatelessComponent(node) {
      const parent = node.parent;
      if (
        node.type === 'FunctionDeclaration'
        && (!node.id || isFirstLetterCapitalized(node.id.name))
        && utils.isReturningJSXOrNull(node)
      ) {
        return node;
      }

      if (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
        const isPropertyAssignment = parent.type === 'AssignmentExpression'
          && parent.left.type === 'MemberExpression';
        const isModuleExportsAssignment = isPropertyAssignment
          && parent.left.object.name === 'module'
          && parent.left.property.name === 'exports';

        if (node.parent.type === 'ExportDefaultDeclaration') {
          if (utils.isReturningJSX(node)) {
            return node;
          }
          return undefined;
        }

        if (node.parent.type === 'VariableDeclarator' && utils.isReturningJSXOrNull(node)) {
          if (isFirstLetterCapitalized(node.parent.id.name)) {
            return node;
          }
          return undefined;
        }

        // case: const any = () => { return (props) => null }
        // case: const any = () => (props) => null
        if (
          (node.parent.type === 'ReturnStatement' || (node.parent.type === 'ArrowFunctionExpression' && node.parent.expression))
          && !utils.isReturningJSX(node)
        ) {
          return undefined;
        }

        // case: any = () => { return => null }
        // case: any = () => null
        if (node.parent.type === 'AssignmentExpression' && !isPropertyAssignment && utils.isReturningJSXOrNull(node)) {
          if (isFirstLetterCapitalized(node.parent.left.name)) {
            return node;
          }
          return undefined;
        }

        // case: any = () => () => null
        if (node.parent.type === 'ArrowFunctionExpression' && node.parent.parent.type === 'AssignmentExpression' && !isPropertyAssignment && utils.isReturningJSXOrNull(node)) {
          if (isFirstLetterCapitalized(node.parent.parent.left.name)) {
            return node;
          }
          return undefined;
        }

        // case: { any: () => () => null }
        if (node.parent.type === 'ArrowFunctionExpression' && node.parent.parent.type === 'Property' && !isPropertyAssignment && utils.isReturningJSXOrNull(node)) {
          if (isFirstLetterCapitalized(node.parent.parent.key.name)) {
            return node;
          }
          return undefined;
        }

        // case: any = function() {return function() {return null;};}
        if (node.parent.type === 'ReturnStatement') {
          if (isFirstLetterCapitalized(node.id && node.id.name)) {
            return node;
          }
          const functionExpr = node.parent.parent.parent;
          if (functionExpr.parent.type === 'AssignmentExpression' && !isPropertyAssignment && utils.isReturningJSXOrNull(node)) {
            if (isFirstLetterCapitalized(functionExpr.parent.left.name)) {
              return node;
            }
            return undefined;
          }
        }

        // case: { any: function() {return function() {return null;};} }
        if (node.parent.type === 'ReturnStatement') {
          const functionExpr = node.parent.parent.parent;
          if (functionExpr.parent.type === 'Property' && !isPropertyAssignment && utils.isReturningJSXOrNull(node)) {
            if (isFirstLetterCapitalized(functionExpr.parent.key.name)) {
              return node;
            }
            return undefined;
          }
        }

        // for case abc = { [someobject.somekey]: props => { ... return not-jsx } }
        if (
          node.parent
          && node.parent.key
          && node.parent.key.type === 'MemberExpression'
          && !utils.isReturningJSX(node)
          && !utils.isReturningOnlyNull(node)
        ) {
          return undefined;
        }

        if (
          node.parent.type === 'Property' && (
            (node.parent.method && !node.parent.computed) // case: { f() { return ... } }
            || (!node.id && !node.parent.computed) // case: { f: () => ... }
          )
        ) {
          if (
            isFirstLetterCapitalized(node.parent.key.name)
            && utils.isReturningJSX(node)
          ) {
            return node;
          }
          return undefined;
        }

        // Case like `Inferno.memo(() => <></>)` or `Inferno.forwardRef(...)`
        const pragmaComponentWrapper = utils.getPragmaComponentWrapper(node);
        if (pragmaComponentWrapper && utils.isReturningJSXOrNull(node)) {
          return pragmaComponentWrapper;
        }

        if (!(utils.isInAllowedPositionForComponent(node) && utils.isReturningJSXOrNull(node))) {
          return undefined;
        }

        if (utils.isParentComponentNotStatelessComponent(node)) {
          return undefined;
        }

        if (node.id) {
          return isFirstLetterCapitalized(node.id.name) ? node : undefined;
        }

        if (
          isPropertyAssignment
          && !isModuleExportsAssignment
          && !isFirstLetterCapitalized(parent.left.property.name)
        ) {
          return undefined;
        }

        if (parent.type === 'Property' && utils.isReturningOnlyNull(node)) {
          return undefined;
        }

        return node;
      }

      return undefined;
    },

    /**
     * Get the parent stateless component node from the current scope
     *
     * @param {ASTNode} node The AST node being checked
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentStatelessComponent(node) {
      let scope = getScope(context, node);
      while (scope) {
        const statelessComponent = utils.getStatelessComponent(scope.block);
        if (statelessComponent) {
          return statelessComponent;
        }
        scope = scope.upper;
      }
      return null;
    },

    /**
     * Get the related component from a node
     *
     * @param {ASTNode} node The AST node being checked (must be a MemberExpression).
     * @returns {ASTNode | null} component node, null if we cannot find the component
     */
    getRelatedComponent(node) {
      let i;
      let j;
      let k;
      let l;
      let componentNode;
      // Get the component path
      const componentPath = [];
      let nodeTemp = node;
      while (nodeTemp) {
        if (nodeTemp.property && nodeTemp.property.type === 'Identifier') {
          componentPath.push(nodeTemp.property.name);
        }
        if (nodeTemp.object && nodeTemp.object.type === 'Identifier') {
          componentPath.push(nodeTemp.object.name);
        }
        nodeTemp = nodeTemp.object;
      }
      componentPath.reverse();
      const componentName = componentPath.slice(0, componentPath.length - 1).join('.');

      // Find the variable in the current scope
      const variableName = componentPath.shift();
      if (!variableName) {
        return null;
      }
      const variableInScope = variableUtil.getVariableFromContext(context, node, variableName);
      if (!variableInScope) {
        return null;
      }

      // Try to find the component using variable references
      variableInScope.references.some((ref) => {
        let refId = ref.identifier;
        if (refId.parent && refId.parent.type === 'MemberExpression') {
          refId = refId.parent;
        }
        if (getText(context, refId) !== componentName) {
          return false;
        }
        if (refId.type === 'MemberExpression') {
          componentNode = refId.parent.right;
        } else if (
          refId.parent
          && refId.parent.type === 'VariableDeclarator'
          && refId.parent.init
          && refId.parent.init.type !== 'Identifier'
        ) {
          componentNode = refId.parent.init;
        }
        return true;
      });

      if (componentNode) {
        // Return the component
        return components.add(componentNode, 1);
      }

      // Try to find the component using variable declarations
      const defs = variableInScope.defs;
      const defInScope = defs.find((def) => (
        def.type === 'ClassName'
        || def.type === 'FunctionName'
        || def.type === 'Variable'
      ));
      if (!defInScope || !defInScope.node) {
        return null;
      }
      componentNode = defInScope.node.init || defInScope.node;

      // Traverse the node properties to the component declaration
      for (i = 0, j = componentPath.length; i < j; i++) {
        if (!componentNode.properties) {
          continue; // eslint-disable-line no-continue
        }
        for (k = 0, l = componentNode.properties.length; k < l; k++) {
          if (componentNode.properties[k].key && componentNode.properties[k].key.name === componentPath[i]) {
            componentNode = componentNode.properties[k];
            break;
          }
        }
        if (!componentNode || !componentNode.value) {
          return null;
        }
        componentNode = componentNode.value;
      }

      // Return the component
      return components.add(componentNode, 1);
    },

    isParentComponentNotStatelessComponent(node) {
      return !!(
        node.parent
        && node.parent.key
        && node.parent.key.type === 'Identifier'
        // custom component functions must start with a capital letter (returns false otherwise)
        && node.parent.key.name.charAt(0) === node.parent.key.name.charAt(0).toLowerCase()
        // inferno render function cannot have params
        && !!(node.params || []).length
      );
    },
  };

  // Component detection instructions
  const detectionInstructions = {
    CallExpression(node) {
      if (!utils.isPragmaComponentWrapper(node)) {
        return;
      }
      if (node.arguments.length > 0 && astUtil.isFunctionLikeExpression(node.arguments[0])) {
        components.add(node, 2);
      }
    },

    ClassExpression(node) {
      if (!componentUtil.isES6Component(node, context)) {
        return;
      }
      components.add(node, 2);
    },

    ClassDeclaration(node) {
      if (!componentUtil.isES6Component(node, context)) {
        return;
      }
      components.add(node, 2);
    },

    ObjectExpression(node) {
      if (!componentUtil.isES5Component(node, context)) {
        return;
      }
      components.add(node, 2);
    },

    FunctionExpression(node) {
      if (node.async && node.generator) {
        components.add(node, 0);
        return;
      }

      const component = utils.getStatelessComponent(node);
      if (!component) {
        return;
      }
      components.add(component, 2);
    },

    FunctionDeclaration(node) {
      if (node.async && node.generator) {
        components.add(node, 0);
        return;
      }

      const cNode = utils.getStatelessComponent(node);
      if (!cNode) {
        return;
      }
      components.add(cNode, 2);
    },

    ArrowFunctionExpression(node) {
      const component = utils.getStatelessComponent(node);
      if (!component) {
        return;
      }
      components.add(component, 2);
    },

    ThisExpression(node) {
      const component = utils.getParentStatelessComponent(node);
      if (!component || !/Function/.test(component.type) || !node.parent.property) {
        return;
      }
      // Ban functions accessing a property on a ThisExpression
      components.add(node, 0);
    },
  };

  // Detect Inferno import specifiers
  const InfernoImportInstructions = {
    ImportDeclaration(node) {
      const isInfernoImported = node.source.type === 'Literal' && node.source.value === 'inferno';
      if (!isInfernoImported) {
        return;
      }

      node.specifiers.forEach((specifier) => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          components.addDefaultInfernoImport(specifier);
        }
        if (specifier.type === 'ImportSpecifier') {
          components.addNamedInfernoImport(specifier);
        }
      });
    },
  };

  const ruleInstructions = rule(context, components, utils);
  const defaultPropsInstructions = defaultPropsUtil(context, components, utils);

  return mergeRules([
    detectionInstructions,
    defaultPropsInstructions,
    InfernoImportInstructions,
    ruleInstructions,
  ]);
}

module.exports = Object.assign(Components, {
  detect(rule) {
    return componentRule.bind(this, rule);
  },
});
