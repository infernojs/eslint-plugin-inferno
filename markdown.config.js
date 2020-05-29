'use strict';

const {rules} = require('./index');

const ruleListItems = Object.keys(rules)
  .sort()
  .map((id) => {
    const {meta} = rules[id];
    const {fixable, docs} = meta;
    return `* [inferno/${id}](docs/rules/${id}.md): ${docs.description}${fixable ? ' (fixable)' : ''}`;
  });

const BASIC_RULES = () => ruleListItems.filter((rule) => !rule.includes('inferno/jsx-')).join('\n');
const JSX_RULES = () => ruleListItems.filter((rule) => rule.includes('inferno/jsx-')).join('\n');

module.exports = {
  transforms: {
    BASIC_RULES,
    JSX_RULES
  },
  callback: () => {
    // eslint-disable-next-line no-console
    console.log('The auto-generating of rules finished!');
  }
};
