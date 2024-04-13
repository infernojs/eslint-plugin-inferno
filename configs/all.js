'use strict';

const allRules = require('../lib/rules');

function filterRules(rules, predicate) {
  return Object.fromEntries(Object.entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, 2>}
 */
function configureAsError(rules) {
  return Object.fromEntries(Object.keys(rules).map((key) => [`inferno/${key}`, 2]));
}

const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

module.exports = {
  plugins: {
    /**
     * @type {{
     *   deprecatedRules: Record<string, import('eslint').Rule.RuleModule>,
     *   rules: Record<string, import('eslint').Rule.RuleModule>,
     * }}
     */
    inferno: {
      deprecatedRules,
      rules: allRules,
    },
  },
  rules: activeRulesConfig,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

// this is so the `languageOptions` property won't be warned in the new config system
Object.defineProperty(module.exports, 'languageOptions', { enumerable: false });
