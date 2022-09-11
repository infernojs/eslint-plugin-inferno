'use strict';

/* eslint-disable no-restricted-syntax */

const { rules } = require('./index');

const ruleTableRows = Object.keys(rules)
  .sort()
  .map((id) => {
    const { meta } = rules[id];
    const { fixable, docs, hasSuggestions } = meta;
    return [
      docs.recommended ? '✔' : '',
      fixable ? '🔧' : '',
      hasSuggestions ? '💡' : '',
      `${docs.description}${meta.deprecated ? '. ❌ This rule is deprecated.' : ''}`,
    ].join(' | ');
  });

const buildRulesTable = (rows) => {
  const header = '✔ | 🔧 | 💡 | Rule | Description';
  const separator = ':---: | :---: | :---: | :--- | :---';

  return [header, separator, ...rows]
    .map((row) => `| ${row} |`)
    .join('\n');
};

const BASIC_RULES = () => buildRulesTable(ruleTableRows.filter((rule) => !rule.includes('inferno/jsx-')));
const JSX_RULES = () => buildRulesTable(ruleTableRows.filter((rule) => rule.includes('inferno/jsx-')));

module.exports = {
  transforms: {
    BASIC_RULES,
    JSX_RULES,
  },
  callback: () => {
    console.log('The auto-generating of rules finished!');
  },
};
