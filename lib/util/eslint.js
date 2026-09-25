'use strict';

function getSourceCode(context) {
  return context.getSourceCode ? context.getSourceCode() : context.sourceCode;
}

function getFilename(context) {
  return context.getFilename ? context.getFilename() : context.filename;
}

function getAncestors(context, node) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getAncestors ? sourceCode.getAncestors(node) : context.getAncestors();
}

function getScope(context, node) {
  const sourceCode = getSourceCode(context);
  if (sourceCode.getScope) {
    return sourceCode.getScope(node);
  }

  return context.getScope();
}

function markVariableAsUsed(name, node, context) {
  const sourceCode = getSourceCode(context);
  return sourceCode.markVariableAsUsed
    ? sourceCode.markVariableAsUsed(name, node)
    : context.markVariableAsUsed(name);
}

function getFirstTokens(context, node, count) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getFirstTokens ? sourceCode.getFirstTokens(node, count) : context.getFirstTokens(node, count);
}

function getText(context, ...args) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getText ? sourceCode.getText(...args) : context.getSource(...args);
}

function getFirstTokenOrSelf(sourceCode, nodeOrToken) {
  if (!nodeOrToken) {
    return null;
  }

  try {
    return sourceCode.getFirstToken(nodeOrToken) || nodeOrToken;
  } catch {
    return nodeOrToken;
  }
}

function getLastTokenOrSelf(sourceCode, nodeOrToken) {
  if (!nodeOrToken) {
    return null;
  }

  try {
    return sourceCode.getLastToken(nodeOrToken) || nodeOrToken;
  } catch {
    return nodeOrToken;
  }
}

function hasWhitespaceInToken(token) {
  return token
    && token.type === 'JSXText'
    && typeof token.value === 'string'
    && token.value.trim() === ''
    && /\s/u.test(token.value);
}

function hasWhitespaceTokenBetween(sourceCode, firstNodeOrToken, secondNodeOrToken) {
  const firstToken = getLastTokenOrSelf(sourceCode, firstNodeOrToken);
  const finalToken = getFirstTokenOrSelf(sourceCode, secondNodeOrToken);

  let currentToken = firstToken;
  while (currentToken && currentToken !== finalToken) {
    const nextToken = sourceCode.getTokenAfter(currentToken, { includeComments: true });

    if (!nextToken) {
      return false;
    }

    if (hasWhitespaceInToken(nextToken)) {
      return true;
    }

    currentToken = nextToken;
  }

  return false;
}

function isSpaceBetweenTokens(context, firstToken, secondToken) {
  const sourceCode = getSourceCode(context);

  if (!firstToken || !secondToken) {
    return false;
  }

  if (
    firstToken.range
    && secondToken.range
    && firstToken.range[0] < secondToken.range[1]
    && secondToken.range[0] < firstToken.range[1]
  ) {
    return false;
  }

  let first = firstToken;
  let second = secondToken;

  // Order does not matter, but the SourceCode APIs generally assume it does.
  if (first.range && second.range && first.range[1] > second.range[0]) {
    [first, second] = [second, first];
  }

  // ESLint v10+ provides `isSpaceBetween`. Older versions used `isSpaceBetweenTokens`.
  if (typeof sourceCode.isSpaceBetweenTokens === 'function') {
    return sourceCode.isSpaceBetweenTokens(first, second);
  }
  if (typeof sourceCode.isSpaceBetween === 'function') {
    return sourceCode.isSpaceBetween(first, second) || hasWhitespaceTokenBetween(sourceCode, first, second);
  }

  if (!first.range || !second.range) {
    return false;
  }

  return /\s/u.test(sourceCode.text.slice(first.range[1], second.range[0]));
}

function isSpaceBetween(context, firstNodeOrToken, secondNodeOrToken) {
  const sourceCode = getSourceCode(context);

  if (!firstNodeOrToken || !secondNodeOrToken) {
    return false;
  }

  if (
    firstNodeOrToken.range
    && secondNodeOrToken.range
    && firstNodeOrToken.range[0] < secondNodeOrToken.range[1]
    && secondNodeOrToken.range[0] < firstNodeOrToken.range[1]
  ) {
    return false;
  }

  let first = firstNodeOrToken;
  let second = secondNodeOrToken;

  // Order does not matter, but the SourceCode APIs generally assume it does.
  if (first.range && second.range && first.range[1] > second.range[0]) {
    [first, second] = [second, first];
  }

  if (typeof sourceCode.isSpaceBetween === 'function') {
    return sourceCode.isSpaceBetween(first, second) || hasWhitespaceTokenBetween(sourceCode, first, second);
  }

  const firstToken = getLastTokenOrSelf(sourceCode, first);
  const secondToken = getFirstTokenOrSelf(sourceCode, second);
  return isSpaceBetweenTokens(context, firstToken, secondToken);
}

/**
 * Removes the whitespace between two tokens or nodes, unless it contains a comment
 * @param {Context} context
 * @param {import('eslint').Rule.RuleFixer} fixer
 * @param {ASTNode | Token} left
 * @param {ASTNode | Token} right
 * @returns {import('eslint').Rule.Fix | null}
 */
function removeSpaceBetween(context, fixer, left, right) {
  if (getSourceCode(context).commentsExistBetween(left, right)) {
    return null;
  }
  return fixer.removeRange([left.range[1], right.range[0]]);
}

function looksLikeExport(node) {
  return node.type === 'ExportDefaultDeclaration'
    || node.type === 'ExportNamedDeclaration'
    || node.type === 'ExportAllDeclaration'
    || node.type === 'ExportSpecifier';
}

/**
 * Port of `SourceCode#getJSDocComment` from ESLint 8/9, which ESLint 10 removed
 * @param {Context} context
 * @param {ASTNode} node
 * @returns {Token | null}
 */
function getJSDocComment(context, node) {
  const sourceCode = getSourceCode(context);

  if (typeof sourceCode.getJSDocComment === 'function') {
    return sourceCode.getJSDocComment(node);
  }

  function findJSDocComment(astNode) {
    const tokenBefore = sourceCode.getTokenBefore(astNode, { includeComments: true });

    if (
      tokenBefore
      && tokenBefore.type === 'Block'
      && tokenBefore.value.charAt(0) === '*'
      && astNode.loc.start.line - tokenBefore.loc.end.line <= 1
    ) {
      return tokenBefore;
    }

    return null;
  }

  let parent = node.parent;

  switch (node.type) {
    case 'ClassDeclaration':
    case 'FunctionDeclaration':
      return findJSDocComment(looksLikeExport(parent) ? parent : node);

    case 'ClassExpression':
      return findJSDocComment(parent.parent);

    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      if (parent.type !== 'CallExpression' && parent.type !== 'NewExpression') {
        while (
          !sourceCode.getCommentsBefore(parent).length
          && !/Function/u.test(parent.type)
          && parent.type !== 'MethodDefinition'
          && parent.type !== 'Property'
        ) {
          parent = parent.parent;

          if (!parent) {
            break;
          }
        }

        if (parent && parent.type !== 'FunctionDeclaration' && parent.type !== 'Program') {
          return findJSDocComment(parent);
        }
      }

      return findJSDocComment(node);

    default:
      return null;
  }
}

module.exports = {
  getAncestors,
  getFilename,
  getFirstTokens,
  getJSDocComment,
  getScope,
  getSourceCode,
  getText,
  isSpaceBetween,
  isSpaceBetweenTokens,
  markVariableAsUsed,
  removeSpaceBetween,
};
