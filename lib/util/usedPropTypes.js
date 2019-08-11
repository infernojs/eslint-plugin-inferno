/**
 * @fileoverview Common used propTypes detection functionality.
 */

'use strict';

const astUtil = require('./ast');
const ast = require('./ast');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

// It is way faster to check existence of property than loop array
const LIFE_CYCLE_METHODS = {
  componentWillReceiveProps: true,
  shouldComponentUpdate: true,
  componentWillUpdate: true,
  componentDidUpdate: true,
  getDerivedStateFromProps: true,
  getSnapshotBeforeUpdate: true
};

function createPropVariables() {
  /** @type {Map<string, string[]>} Maps the variable to its definition. `props.a.b` is stored as `['a', 'b']` */
  let propVariables = new Map();
  let hasBeenWritten = false;
  const stack = [{propVariables, hasBeenWritten}];
  return {
    pushScope() {
      // popVariables is not copied until first write.
      stack.push({propVariables, hasBeenWritten: false});
    },
    popScope() {
      stack.pop();
      propVariables = stack[stack.length - 1].propVariables;
      hasBeenWritten = stack[stack.length - 1].hasBeenWritten;
    },
    /**
     * Add a variable name to the current scope
     * @param {string} name
     * @param {string[]} allNames Example: `props.a.b` should be formatted as `['a', 'b']`
     */
    set(name, allNames) {
      if (!hasBeenWritten) {
        // copy on write
        propVariables = new Map(propVariables);
        Object.assign(stack[stack.length - 1], {propVariables, hasBeenWritten: true});
        stack[stack.length - 1].hasBeenWritten = true;
      }
      return propVariables.set(name, allNames);
    },
    /**
     * Get the definition of a variable.
     * @param {string} name
     * @returns {string[]} Example: `props.a.b` is represented by `['a', 'b']`
     */
    get(name) {
      return propVariables.get(name);
    }
  };
}

/**
 * Checks if the string is one of `props`, `nextProps`, or `prevProps`
 * @param {string} name The AST node being checked.
 * @returns {Boolean} True if the prop name matches
 */
function isCommonVariableNameForProps(name) {
  return name === 'props' || name === 'nextProps' || name === 'prevProps';
}

/**
 * Checks if the component must be validated
 * @param {Object} component The component to process
 * @returns {Boolean} True if the component must be validated, false if not.
 */
function mustBeValidated(component) {
  return !!(component && !component.ignorePropsValidation);
}

/**
 * Check if we are in a lifecycle method
 * @return {boolean} true if we are in a class constructor, false if not
 */
function inLifeCycleMethod(context) {
  let scope = context.getScope();
  while (scope) {
    if (scope.block && scope.block.parent && scope.block.parent.key) {
      return LIFE_CYCLE_METHODS[scope.block.parent.key.name] === true;
    }
    scope = scope.upper;
  }
  return false;
}

/**
 * Returns true if the given node is a Inferno Component lifecycle method
 * @param {ASTNode} node The AST node being checked.
 * @return {Boolean} True if the node is a lifecycle method
 */
function isNodeALifeCycleMethod(node) {
  const nodeKeyName = (node.key || /** @type {ASTNode} */ ({})).name;

  if (node.kind === 'constructor') {
    return true;
  }

  return LIFE_CYCLE_METHODS[nodeKeyName] === true;
}

/**
 * Returns true if the given node is inside a Inferno Component lifecycle
 * method.
 * @param {ASTNode} node The AST node being checked.
 * @return {Boolean} True if the node is inside a lifecycle method
 */
function isInLifeCycleMethod(node) {
  if ((node.type === 'MethodDefinition' || node.type === 'Property') && isNodeALifeCycleMethod(node)) {
    return true;
  }

  if (node.parent) {
    return isInLifeCycleMethod(node.parent);
  }

  return false;
}

/**
 * Check if a function node is a setState updater
 * @param {ASTNode} node a function node
 * @return {boolean}
 */
function isSetStateUpdater(node) {
  return node.parent.type === 'CallExpression' &&
    node.parent.callee.property &&
    node.parent.callee.property.name === 'setState' &&
    // Make sure we are in the updater not the callback
    node.parent.arguments[0] === node;
}

function isPropArgumentInSetStateUpdater(context, name) {
  if (typeof name !== 'string') {
    return false;
  }
  let scope = context.getScope();
  while (scope) {
    if (
      scope.block && scope.block.parent &&
      scope.block.parent.type === 'CallExpression' &&
      scope.block.parent.callee.property &&
      scope.block.parent.callee.property.name === 'setState' &&
      // Make sure we are in the updater not the callback
      scope.block.parent.arguments[0].start === scope.block.start &&
      scope.block.parent.arguments[0].params &&
      scope.block.parent.arguments[0].params.length > 1
    ) {
      return scope.block.parent.arguments[0].params[1].name === name;
    }
    scope = scope.upper;
  }
  return false;
}

function isInClassComponent(utils) {
  return utils.getParentES6Component() || utils.getParentES5Component();
}

/**
 * Checks if the node is `this.props`
 * @param {ASTNode|undefined} node
 * @returns {boolean}
 */
function isThisDotProps(node) {
  return !!node &&
    node.type === 'MemberExpression' &&
    node.object.type === 'ThisExpression' &&
    node.property.name === 'props';
}

/**
 * Checks if the prop has spread operator.
 * @param {ASTNode} node The AST node being marked.
 * @returns {Boolean} True if the prop has spread operator, false if not.
 */
function hasSpreadOperator(context, node) {
  const tokens = context.getSourceCode().getTokens(node);
  return tokens.length && tokens[0].value === '...';
}

/**
 * Retrieve the name of a property node
 * @param {ASTNode} node The AST node with the property.
 * @return {string|undefined} the name of the property or undefined if not found
 */
function getPropertyName(node) {
  const property = node.property;
  if (property) {
    switch (property.type) {
      case 'Identifier':
        if (node.computed) {
          return '__COMPUTED_PROP__';
        }
        return property.name;
      case 'MemberExpression':
        return;
      case 'Literal':
        // Accept computed properties that are literal strings
        if (typeof property.value === 'string') {
          return property.value;
        }
        // falls through
      default:
        if (node.computed) {
          return '__COMPUTED_PROP__';
        }
        break;
    }
  }
}

/**
 * Checks if the node is a propTypes usage of the form `this.props.*`, `props.*`, `prevProps.*`, or `nextProps.*`.
 * @param {ASTNode} node
 * @param {Context} context
 * @param {Object} utils
 * @returns {boolean}
 */
function isPropTypesUsageByMemberExpression(node, context, utils) {
  if (isInClassComponent(utils)) {
    // this.props.*
    if (isThisDotProps(node.object)) {
      return true;
    }
    // props.* or prevProps.* or nextProps.*
    if (
      isCommonVariableNameForProps(node.object.name) &&
      (inLifeCycleMethod(context) || utils.inConstructor())
    ) {
      return true;
    }
    // this.setState((_, props) => props.*))
    return isPropArgumentInSetStateUpdater(context, node.object.name);
  }
  // props.* in function component
  return node.object.name === 'props' && !ast.isAssignmentLHS(node);
}

module.exports = function usedPropTypesInstructions(context, components, utils) {
  const propVariables = createPropVariables();
  const pushScope = propVariables.pushScope;
  const popScope = propVariables.popScope;

  /**
   * Mark a prop type as used
   * @param {ASTNode} node The AST node being marked.
   * @param {string[]} [parentNames]
   */
  function markPropTypesAsUsed(node, parentNames) {
    parentNames = parentNames || [];
    let type;
    let name;
    let allNames;
    let properties;
    switch (node.type) {
      case 'MemberExpression':
        name = getPropertyName(node);
        if (name) {
          allNames = parentNames.concat(name);
          if (
            // Match props.foo.bar, don't match bar[props.foo]
            node.parent.type === 'MemberExpression' &&
            node.parent.object === node
          ) {
            markPropTypesAsUsed(node.parent, allNames);
          }
          // Handle the destructuring part of `const {foo} = props.a.b`
          if (
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id.type === 'ObjectPattern'
          ) {
            node.parent.id.parent = node.parent; // patch for bug in eslint@4 in which ObjectPattern has no parent
            markPropTypesAsUsed(node.parent.id, allNames);
          }

          // const a = props.a
          if (
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id.type === 'Identifier'
          ) {
            propVariables.set(node.parent.id.name, allNames);
          }
          // Do not mark computed props as used.
          type = name !== '__COMPUTED_PROP__' ? 'direct' : null;
        }
        break;
      case 'ArrowFunctionExpression':
      case 'FunctionDeclaration':
      case 'FunctionExpression': {
        if (node.params.length === 0) {
          break;
        }
        type = 'destructuring';
        const propParam = isSetStateUpdater(node) ? node.params[1] : node.params[0];
        properties = propParam.type === 'AssignmentPattern' ?
          propParam.left.properties :
          propParam.properties;
        break;
      }
      case 'ObjectPattern':
        type = 'destructuring';
        properties = node.properties;
        break;
      default:
        throw new Error(`${node.type} ASTNodes are not handled by markPropTypesAsUsed`);
    }

    const component = components.get(utils.getParentComponent());
    const usedPropTypes = component && component.usedPropTypes || [];
    let ignoreUnusedPropTypesValidation = component && component.ignoreUnusedPropTypesValidation || false;

    switch (type) {
      case 'direct': {
        // Ignore Object methods
        if (name in Object.prototype) {
          break;
        }

        const reportedNode = node.property;
        usedPropTypes.push({
          name,
          allNames,
          node: reportedNode
        });
        break;
      }
      case 'destructuring': {
        for (let k = 0, l = (properties || []).length; k < l; k++) {
          if (hasSpreadOperator(context, properties[k]) || properties[k].computed) {
            ignoreUnusedPropTypesValidation = true;
            break;
          }
          const propName = ast.getKeyValue(context, properties[k]);

          if (propName) {
            propVariables.set(propName, parentNames.concat(propName));
            usedPropTypes.push({
              allNames: parentNames.concat([propName]),
              name: propName,
              node: properties[k]
            });
          }

          if (
            propName &&
            properties[k].type === 'Property' &&
            properties[k].value.type === 'ObjectPattern'
          ) {
            markPropTypesAsUsed(properties[k].value, parentNames.concat([propName]));
          }
        }
        break;
      }
      default:
        break;
    }

    components.set(component ? component.node : node, {
      usedPropTypes,
      ignoreUnusedPropTypesValidation
    });
  }

  /**
   * @param {ASTNode} node We expect either an ArrowFunctionExpression,
   *   FunctionDeclaration, or FunctionExpression
   */
  function markDestructuredFunctionArgumentsAsUsed(node) {
    const param = node.params && isSetStateUpdater(node) ? node.params[1] : node.params[0];

    const destructuring = param && (
      param.type === 'ObjectPattern' ||
      param.type === 'AssignmentPattern' && param.left.type === 'ObjectPattern'
    );

    if (destructuring && (components.get(node) || components.get(node.parent))) {
      markPropTypesAsUsed(node);
    }
  }

  function handleSetStateUpdater(node) {
    if (!node.params || node.params.length < 2 || !isSetStateUpdater(node)) {
      return;
    }
    markPropTypesAsUsed(node);
  }

  /**
   * Handle both stateless functions and setState updater functions.
   * @param {ASTNode} node We expect either an ArrowFunctionExpression,
   *   FunctionDeclaration, or FunctionExpression
   */
  function handleFunctionLikeExpressions(node) {
    pushScope();
    handleSetStateUpdater(node);
    markDestructuredFunctionArgumentsAsUsed(node);
  }

  function handleCustomValidators(component) {
    const propTypes = component.declaredPropTypes;
    if (!propTypes) {
      return;
    }

    Object.keys(propTypes).forEach((key) => {
      const node = propTypes[key].node;

      if (node.value && astUtil.isFunctionLikeExpression(node.value)) {
        markPropTypesAsUsed(node.value);
      }
    });
  }

  return {
    VariableDeclarator(node) {
      // let props = this.props
      if (isThisDotProps(node.init) && isInClassComponent(utils) && node.id.type === 'Identifier') {
        propVariables.set(node.id.name, []);
      }

      // Only handles destructuring
      if (node.id.type !== 'ObjectPattern' || !node.init) {
        return;
      }

      // let {props: {firstname}} = this
      const propsProperty = node.id.properties.find(property => (
        property.key &&
        (property.key.name === 'props' || property.key.value === 'props')
      ));
      if (node.init.type === 'ThisExpression' && propsProperty && propsProperty.value.type === 'ObjectPattern') {
        markPropTypesAsUsed(propsProperty.value);
        return;
      }

      // let {props} = this
      if (node.init.type === 'ThisExpression' && propsProperty && propsProperty.value.name === 'props') {
        propVariables.set('props', []);
        return;
      }

      // let {firstname} = props
      if (
        isCommonVariableNameForProps(node.init.name) &&
        (utils.getParentStatelessComponent() || isInLifeCycleMethod(node))
      ) {
        markPropTypesAsUsed(node.id);
        return;
      }

      // let {firstname} = this.props
      if (isThisDotProps(node.init) && isInClassComponent(utils)) {
        markPropTypesAsUsed(node.id);
        return;
      }

      // let {firstname} = thing, where thing is defined by const thing = this.props.**.*
      if (propVariables.get(node.init.name)) {
        markPropTypesAsUsed(node.id, propVariables.get(node.init.name));
      }
    },

    FunctionDeclaration: handleFunctionLikeExpressions,

    ArrowFunctionExpression: handleFunctionLikeExpressions,

    FunctionExpression: handleFunctionLikeExpressions,

    'FunctionDeclaration:exit': popScope,

    'ArrowFunctionExpression:exit': popScope,

    'FunctionExpression:exit': popScope,

    JSXSpreadAttribute(node) {
      const component = components.get(utils.getParentComponent());
      components.set(component ? component.node : node, {
        ignoreUnusedPropTypesValidation: true
      });
    },

    MemberExpression(node) {
      if (isPropTypesUsageByMemberExpression(node, context, utils)) {
        markPropTypesAsUsed(node);
        return;
      }

      if (propVariables.get(node.object.name)) {
        markPropTypesAsUsed(node, propVariables.get(node.object.name));
      }
    },

    ObjectPattern(node) {
      // If the object pattern is a destructured props object in a lifecycle
      // method -- mark it for used props.
      if (isNodeALifeCycleMethod(node.parent.parent) && node.properties.length > 0) {
        markPropTypesAsUsed(node.parent);
      }
    },

    'Program:exit': function () {
      const list = components.list();

      Object.keys(list).filter(component => mustBeValidated(list[component])).forEach((component) => {
        handleCustomValidators(list[component]);
      });
    }
  };
};
