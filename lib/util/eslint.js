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

function getJSDocComment(context, node) {
  const sourceCode = getSourceCode(context);

  if (typeof sourceCode.getJSDocComment === 'function') {
    return sourceCode.getJSDocComment(node);
  }

  const comment = sourceCode.getTokenBefore(node, { includeComments: true });

  if (!comment || comment.type !== 'Block' || !comment.value.startsWith('*')) {
    return null;
  }

  const textBetween = sourceCode.text.slice(comment.range[1], node.range[0]);

  // Only consider it a JSDoc comment when it's directly attached to the node.
  if (textBetween.trim() !== '' || /\n\s*\n/.test(textBetween)) {
    return null;
  }

  return comment;
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
};
