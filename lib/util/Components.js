/**
 * @fileoverview Utility class and functions for Inferno components detection
 * @author Yannick Croissant
 */

'use strict';

const doctrine = require('doctrine');
const arrayIncludes = require('array-includes');

const variableUtil = require('./variable');
const pragmaUtil = require('./pragma');
const astUtil = require('./ast');
const jsxUtil = require('./jsx');
const defaultPropsUtil = require('./defaultProps');

function getId(node) {
  return node && node.range.join(':');
}

const LISTS = new WeakMap();
const ALL_KEYS = [
  'CallExpression',
  'ClassExpression',
  'ClassDeclaration',
  'ClassProperty',
  'ObjectExpression',
  'FunctionExpression',
  'FunctionDeclaration',
  'ArrowFunctionExpression',
  'ThisExpression',
  'ReturnStatement',
  'MemberExpression',
  'MethodDefinition'
];

function ruleInstructionsCaller(
  instructionKey,
  detectionInstructions,
  defaultPropsInstructions,
  ruleInstructions,
  node
) {
  if (detectionInstructions[instructionKey]) {
    detectionInstructions[instructionKey](node);
  }
  if (defaultPropsInstructions[instructionKey]) {
    defaultPropsInstructions[instructionKey](node);
  }
  if (ruleInstructions[instructionKey]) {
    return ruleInstructions[instructionKey](node);
  }
}

/**
 * Components
 */
class Components {
  constructor() {
    LISTS.set(this, new Map());
  }

  /**
   * Add a node to the components list, or update it if it's already in the list
   *
   * @param {ASTNode} node The AST node being added.
   * @param {Number} confidence Confidence in the component detection (0=banned, 1=maybe, 2=yes)
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
        confidence
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
    while (!component) {
      node = node.parent;
      if (!node) {
        return;
      }
      component = list.get(getId(node));
    }

    Object.assign(
      component,
      props
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
   * @returns {Number} Components list length
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
}

function componentRule(rule, context) {
  const createClass = pragmaUtil.getCreateClassFromContext(context);
  const pragma = pragmaUtil.getFromContext(context);
  const sourceCode = context.getSourceCode();
  const components = new Components();
  const es5regex = new RegExp(`^(${pragma}\\.)?${createClass}$`);
  const es6regex = new RegExp(`^(${pragma}\\.)?(Pure)?Component$`);
  const pureRegex = new RegExp(`^(${pragma}\\.)?PureComponent$`);

  // Utilities for component detection
  const utils = {

    /**
     * Check if the node is a Inferno ES5 component
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the node is a Inferno ES5 component, false if not
     */
    isES5Component(node) {
      if (!node.parent) {
        return false;
      }
      return es5regex.test(sourceCode.getText(node.parent.callee));
    },

    /**
     * Check if the node is a Inferno ES6 component
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the node is a Inferno ES6 component, false if not
     */
    isES6Component(node) {
      if (utils.isExplicitComponent(node)) {
        return true;
      }

      if (!node.superClass) {
        return false;
      }
      return es6regex.test(sourceCode.getText(node.superClass));
    },

    /**
     * Check if the node is explicitly declared as a descendant of a Inferno Component
     *
     * @param {ASTNode} node The AST node being checked (can be a ReturnStatement or an ArrowFunctionExpression).
     * @returns {Boolean} True if the node is explicitly declared as a descendant of a Inferno Component, false if not
     */
    isExplicitComponent(node) {
      // Sometimes the passed node may not have been parsed yet by eslint, and this function call crashes.
      // Can be removed when eslint sets "parent" property for all nodes on initial AST traversal: https://github.com/eslint/eslint-scope/issues/27
      // eslint-disable-next-line no-warning-comments
      const comment = sourceCode.getJSDocComment(node);

      if (comment === null) {
        return false;
      }

      const commentAst = doctrine.parse(comment.value, {
        unwrap: true,
        tags: ['extends', 'augments']
      });

      return commentAst.tags.some(tag => tag.name === 'Inferno.Component' || tag.name === 'Inferno.PureComponent');
    },

    /**
     * Checks to see if our component extends Inferno.PureComponent
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if node extends Inferno.PureComponent, false if not
     */
    isPureComponent(node) {
      if (node.superClass) {
        return pureRegex.test(sourceCode.getText(node.superClass));
      }
      return false;
    },

    /**
     * Check if variable is destructured from pragma import
     *
     * @param {string} variable The variable name to check
     * @returns {Boolean} True if createElement is destructured from the pragma
     */
    isDestructuredFromPragmaImport(variable) {
      const variables = variableUtil.variablesInScope(context);
      const variableInScope = variableUtil.getVariable(variables, variable);
      if (variableInScope) {
        const map = variableInScope.scope.set;
        return map.has(pragma);
      }
      return false;
    },

    /**
     * Checks to see if node is called within createElement from pragma
     *
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if createElement called from pragma
     */
    isCreateElement(node) {
      const calledOnPragma = (
        node &&
        node.callee &&
        node.callee.object &&
        node.callee.object.name === pragma &&
        node.callee.property &&
        node.callee.property.name === 'createElement'
      );

      const calledDirectly = (
        node &&
        node.callee &&
        node.callee.name === 'createElement'
      );

      if (this.isDestructuredFromPragmaImport('createElement')) {
        return calledDirectly || calledOnPragma;
      }
      return calledOnPragma;
    },

    /**
     * Check if we are in a class constructor
     * @return {boolean} true if we are in a class constructor, false if not
     */
    inConstructor() {
      let scope = context.getScope();
      while (scope) {
        if (scope.block && scope.block.parent && scope.block.parent.kind === 'constructor') {
          return true;
        }
        scope = scope.upper;
      }
      return false;
    },

    /**
     * Determine if the node is MemberExpression of `this.state`
     * @param {Object} node The node to process
     * @returns {Boolean}
     */
    isStateMemberExpression(node) {
      return node.type === 'MemberExpression' && node.object.type === 'ThisExpression' && node.property.name === 'state';
    },

    getReturnPropertyAndNode(ASTnode) {
      let property;
      let node = ASTnode;
      switch (node.type) {
        case 'ReturnStatement':
          property = 'argument';
          break;
        case 'ArrowFunctionExpression':
          property = 'body';
          if (node[property] && node[property].type === 'BlockStatement') {
            node = utils.findReturnStatement(node);
            property = 'argument';
          }
          break;
        default:
          node = utils.findReturnStatement(node);
          property = 'argument';
      }
      return {
        node,
        property
      };
    },

    /**
     * Check if the node is returning JSX
     *
     * @param {ASTNode} ASTnode The AST node being checked
     * @param {Boolean} [strict] If true, in a ternary condition the node must return JSX in both cases
     * @returns {Boolean} True if the node is returning JSX, false if not
     */
    isReturningJSX(ASTnode, strict) {
      const nodeAndProperty = utils.getReturnPropertyAndNode(ASTnode);
      const node = nodeAndProperty.node;
      const property = nodeAndProperty.property;

      if (!node) {
        return false;
      }

      const returnsConditionalJSXConsequent = node[property] &&
        node[property].type === 'ConditionalExpression' &&
        jsxUtil.isJSX(node[property].consequent);
      const returnsConditionalJSXAlternate = node[property] &&
        node[property].type === 'ConditionalExpression' &&
        jsxUtil.isJSX(node[property].alternate);
      const returnsConditionalJSX = strict ?
        (returnsConditionalJSXConsequent && returnsConditionalJSXAlternate) :
        (returnsConditionalJSXConsequent || returnsConditionalJSXAlternate);

      const returnsJSX = node[property] &&
        jsxUtil.isJSX(node[property]);
      const returnsPragmaCreateElement = this.isCreateElement(node[property]);

      return Boolean(
        returnsConditionalJSX ||
        returnsJSX ||
        returnsPragmaCreateElement
      );
    },

    /**
     * Check if the node is returning null
     *
     * @param {ASTNode} ASTnode The AST node being checked
     * @returns {Boolean} True if the node is returning null, false if not
     */
    isReturningNull(ASTnode) {
      const nodeAndProperty = utils.getReturnPropertyAndNode(ASTnode);
      const property = nodeAndProperty.property;
      const node = nodeAndProperty.node;

      if (!node) {
        return false;
      }

      return node[property] && node[property].value === null;
    },

    /**
     * Check if the node is returning JSX or null
     *
     * @param {ASTNode} ASTnode The AST node being checked
     * @param {Boolean} [strict] If true, in a ternary condition the node must return JSX in both cases
     * @returns {Boolean} True if the node is returning JSX or null, false if not
     */
    isReturningJSXOrNull(ASTNode, strict) {
      return utils.isReturningJSX(ASTNode, strict) || utils.isReturningNull(ASTNode);
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

    isPragmaComponentWrapper(node) {
      if (!node || node.type !== 'CallExpression') {
        return false;
      }
      const propertyNames = ['forwardRef', 'memo'];
      const calleeObject = node.callee.object;
      if (calleeObject && node.callee.property) {
        return arrayIncludes(propertyNames, node.callee.property.name) && calleeObject.name === pragma;
      }
      return arrayIncludes(propertyNames, node.callee.name) && this.isDestructuredFromPragmaImport(node.callee.name);
    },

    /**
     * Find a return statment in the current node
     *
     * @param {ASTNode} ASTnode The AST node being checked
     */
    findReturnStatement: astUtil.findReturnStatement,

    /**
     * Get the parent component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentComponent() {
      return (
        utils.getParentES6Component() ||
        utils.getParentES5Component() ||
        utils.getParentStatelessComponent()
      );
    },

    /**
     * Get the parent ES5 component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentES5Component() {
      let scope = context.getScope();
      while (scope) {
        const node = scope.block && scope.block.parent && scope.block.parent.parent;
        if (node && utils.isES5Component(node)) {
          return node;
        }
        scope = scope.upper;
      }
      return null;
    },

    /**
     * Get the parent ES6 component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentES6Component() {
      let scope = context.getScope();
      while (scope && scope.type !== 'class') {
        scope = scope.upper;
      }
      const node = scope && scope.block;
      if (!node || !utils.isES6Component(node)) {
        return null;
      }
      return node;
    },

    /**
     * Get the parent stateless component node from the current scope
     *
     * @returns {ASTNode} component node, null if we are not in a component
     */
    getParentStatelessComponent() {
      let scope = context.getScope();
      while (scope) {
        const node = scope.block;
        const isFunction = /Function/.test(node.type); // Functions
        const isArrowFunction = astUtil.isArrowFunction(node);
        const enclosingScope = isArrowFunction ? utils.getArrowFunctionScope(scope) : scope;
        const enclosingScopeParent = enclosingScope && enclosingScope.block.parent;
        const isClass = enclosingScope && astUtil.isClass(enclosingScope.block);
        const isMethod = enclosingScopeParent && enclosingScopeParent.type === 'MethodDefinition'; // Classes methods
        const isArgument = node.parent && node.parent.type === 'CallExpression'; // Arguments (callback, etc.)
        // Attribute Expressions inside JSX Elements (<button onClick={() => props.handleClick()}></button>)
        const isJSXExpressionContainer = node.parent && node.parent.type === 'JSXExpressionContainer';
        const pragmaComponentWrapper = this.getPragmaComponentWrapper(node);
        if (isFunction && pragmaComponentWrapper) {
          return pragmaComponentWrapper;
        }
        // Stop moving up if we reach a class or an argument (like a callback)
        if (isClass || isArgument) {
          return null;
        }
        // Return the node if it is a function that is not a class method and is not inside a JSX Element
        if (isFunction && !isMethod && !isJSXExpressionContainer && utils.isReturningJSXOrNull(node)) {
          return node;
        }
        scope = scope.upper;
      }
      return null;
    },

    /**
     * Get an enclosing scope used to find `this` value by an arrow function
     * @param {Scope} scope Current scope
     * @returns {Scope} An enclosing scope used by an arrow function
     */
    getArrowFunctionScope(scope) {
      scope = scope.upper;
      while (scope) {
        if (astUtil.isFunction(scope.block) || astUtil.isClass(scope.block)) {
          return scope;
        }
        scope = scope.upper;
      }
      return null;
    },

    /**
     * Get the related component from a node
     *
     * @param {ASTNode} node The AST node being checked (must be a MemberExpression).
     * @returns {ASTNode} component node, null if we cannot find the component
     */
    getRelatedComponent(node) {
      let i;
      let j;
      let k;
      let l;
      let componentNode;
      // Get the component path
      const componentPath = [];
      while (node) {
        if (node.property && node.property.type === 'Identifier') {
          componentPath.push(node.property.name);
        }
        if (node.object && node.object.type === 'Identifier') {
          componentPath.push(node.object.name);
        }
        node = node.object;
      }
      componentPath.reverse();
      const componentName = componentPath.slice(0, componentPath.length - 1).join('.');

      // Find the variable in the current scope
      const variableName = componentPath.shift();
      if (!variableName) {
        return null;
      }
      let variableInScope;
      const variables = variableUtil.variablesInScope(context);
      for (i = 0, j = variables.length; i < j; i++) {
        if (variables[i].name === variableName) {
          variableInScope = variables[i];
          break;
        }
      }
      if (!variableInScope) {
        return null;
      }

      // Try to find the component using variable references
      const refs = variableInScope.references;
      refs.some((ref) => {
        let refId = ref.identifier;
        if (refId.parent && refId.parent.type === 'MemberExpression') {
          refId = refId.parent;
        }
        if (sourceCode.getText(refId) !== componentName) {
          return false;
        }
        if (refId.type === 'MemberExpression') {
          componentNode = refId.parent.right;
        } else if (
          refId.parent &&
          refId.parent.type === 'VariableDeclarator' &&
          refId.parent.init &&
          refId.parent.init.type !== 'Identifier'
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
      const defInScope = defs.find(def => (
        def.type === 'ClassName' ||
        def.type === 'FunctionName' ||
        def.type === 'Variable'
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
    }
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
      if (!utils.isES6Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    ClassDeclaration(node) {
      if (!utils.isES6Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    ClassProperty(node) {
      node = utils.getParentComponent();
      if (!node) {
        return;
      }
      components.add(node, 2);
    },

    ObjectExpression(node) {
      if (!utils.isES5Component(node)) {
        return;
      }
      components.add(node, 2);
    },

    FunctionExpression(node) {
      if (node.async) {
        components.add(node, 0);
        return;
      }
      const component = utils.getParentComponent();
      if (
        !component ||
        (component.parent && component.parent.type === 'JSXExpressionContainer')
      ) {
        // Ban the node if we cannot find a parent component
        components.add(node, 0);
        return;
      }
      components.add(component, 1);
    },

    FunctionDeclaration(node) {
      if (node.async) {
        components.add(node, 0);
        return;
      }
      node = utils.getParentComponent();
      if (!node) {
        return;
      }
      components.add(node, 1);
    },

    ArrowFunctionExpression(node) {
      if (node.async) {
        components.add(node, 0);
        return;
      }
      const component = utils.getParentComponent();
      if (
        !component ||
        (component.parent && component.parent.type === 'JSXExpressionContainer')
      ) {
        // Ban the node if we cannot find a parent component
        components.add(node, 0);
        return;
      }
      if (component.expression && utils.isReturningJSX(component)) {
        components.add(component, 2);
      } else {
        components.add(component, 1);
      }
    },

    ThisExpression(node) {
      const component = utils.getParentComponent();
      if (!component || !/Function/.test(component.type) || !node.parent.property) {
        return;
      }
      // Ban functions accessing a property on a ThisExpression
      components.add(node, 0);
    },

    ReturnStatement(node) {
      if (!utils.isReturningJSX(node)) {
        return;
      }
      node = utils.getParentComponent();
      if (!node) {
        const scope = context.getScope();
        components.add(scope.block, 1);
        return;
      }
      components.add(node, 2);
    }
  };

  // Update the provided rule instructions to add the component detection
  const ruleInstructions = rule(context, components, utils);
  const updatedRuleInstructions = Object.assign({}, ruleInstructions);
  const defaultPropsInstructions = defaultPropsUtil(context, components, utils);

  for (let i = 0; i < ALL_KEYS.length; i++) {
    const instructionKey = ALL_KEYS[i];

    updatedRuleInstructions[instructionKey] = ruleInstructionsCaller.bind(
      null,
      instructionKey,
      detectionInstructions,
      defaultPropsInstructions,
      ruleInstructions
    );
  }

  // Return the updated rule instructions
  return updatedRuleInstructions;
}

module.exports = Object.assign(Components, {
  detect(rule) {
    return componentRule.bind(this, rule);
  }
});
