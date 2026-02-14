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
  markVariableAsUsed,
};
