'use strict';

const has = require('has');

const allRules = {
  'button-has-type': require('./lib/rules/button-has-type'),
  'destructuring-assignment': require('./lib/rules/destructuring-assignment'),
  'forbid-component-props': require('./lib/rules/forbid-component-props'),
  'forbid-dom-props': require('./lib/rules/forbid-dom-props'),
  'forbid-elements': require('./lib/rules/forbid-elements'),
  'jsx-boolean-value': require('./lib/rules/jsx-boolean-value'),
  'jsx-child-element-spacing': require('./lib/rules/jsx-child-element-spacing'),
  'jsx-closing-bracket-location': require('./lib/rules/jsx-closing-bracket-location'),
  'jsx-closing-tag-location': require('./lib/rules/jsx-closing-tag-location'),
  'jsx-curly-spacing': require('./lib/rules/jsx-curly-spacing'),
  'jsx-equals-spacing': require('./lib/rules/jsx-equals-spacing'),
  'jsx-filename-extension': require('./lib/rules/jsx-filename-extension'),
  'jsx-first-prop-new-line': require('./lib/rules/jsx-first-prop-new-line'),
  'jsx-handler-names': require('./lib/rules/jsx-handler-names'),
  'jsx-indent': require('./lib/rules/jsx-indent'),
  'jsx-indent-props': require('./lib/rules/jsx-indent-props'),
  'jsx-key': require('./lib/rules/jsx-key'),
  'jsx-max-depth': require('./lib/rules/jsx-max-depth'),
  'jsx-max-props-per-line': require('./lib/rules/jsx-max-props-per-line'),
  'jsx-no-bind': require('./lib/rules/jsx-no-bind'),
  'jsx-no-comment-textnodes': require('./lib/rules/jsx-no-comment-textnodes'),
  'jsx-no-duplicate-props': require('./lib/rules/jsx-no-duplicate-props'),
  'jsx-no-literals': require('./lib/rules/jsx-no-literals'),
  'jsx-no-target-blank': require('./lib/rules/jsx-no-target-blank'),
  'jsx-one-expression-per-line': require('./lib/rules/jsx-one-expression-per-line'),
  'jsx-no-undef': require('./lib/rules/jsx-no-undef'),
  'jsx-curly-brace-presence': require('./lib/rules/jsx-curly-brace-presence'),
  'jsx-pascal-case': require('./lib/rules/jsx-pascal-case'),
  'jsx-sort-default-props': require('./lib/rules/jsx-sort-default-props'),
  'jsx-sort-props': require('./lib/rules/jsx-sort-props'),
  'jsx-space-before-closing': require('./lib/rules/jsx-space-before-closing'),
  'jsx-tag-spacing': require('./lib/rules/jsx-tag-spacing'),
  'jsx-uses-inferno': require('./lib/rules/jsx-uses-inferno'),
  'jsx-uses-vars': require('./lib/rules/jsx-uses-vars'),
  'jsx-wrap-multilines': require('./lib/rules/jsx-wrap-multilines'),
  'no-access-state-in-setstate': require('./lib/rules/no-access-state-in-setstate'),
  'no-array-index-key': require('./lib/rules/no-array-index-key'),
  'no-children-prop': require('./lib/rules/no-children-prop'),
  'no-danger': require('./lib/rules/no-danger'),
  'no-danger-with-children': require('./lib/rules/no-danger-with-children'),
  'no-did-mount-set-state': require('./lib/rules/no-did-mount-set-state'),
  'no-did-update-set-state': require('./lib/rules/no-did-update-set-state'),
  'no-direct-mutation-state': require('./lib/rules/no-direct-mutation-state'),
  'no-find-dom-node': require('./lib/rules/no-find-dom-node'),
  'no-is-mounted': require('./lib/rules/no-is-mounted'),
  'no-multi-comp': require('./lib/rules/no-multi-comp'),
  'no-set-state': require('./lib/rules/no-set-state'),
  'no-string-refs': require('./lib/rules/no-string-refs'),
  'no-redundant-should-component-update': require('./lib/rules/no-redundant-should-component-update'),
  'no-render-return-value': require('./lib/rules/no-render-return-value'),
  'no-this-in-sfc': require('./lib/rules/no-this-in-sfc'),
  'no-typos': require('./lib/rules/no-typos'),
  'no-unescaped-entities': require('./lib/rules/no-unescaped-entities'),
  'no-unknown-property': require('./lib/rules/no-unknown-property'),
  'no-unused-state': require('./lib/rules/no-unused-state'),
  'no-will-update-set-state': require('./lib/rules/no-will-update-set-state'),
  'prefer-es6-class': require('./lib/rules/prefer-es6-class'),
  'prefer-stateless-function': require('./lib/rules/prefer-stateless-function'),
  'inferno-in-jsx-scope': require('./lib/rules/inferno-in-jsx-scope'),
  'require-optimization': require('./lib/rules/require-optimization'),
  'require-render-return': require('./lib/rules/require-render-return'),
  'self-closing-comp': require('./lib/rules/self-closing-comp'),
  'sort-comp': require('./lib/rules/sort-comp'),
  'style-prop-object': require('./lib/rules/style-prop-object'),
  'void-dom-elements-no-children': require('./lib/rules/void-dom-elements-no-children')
};

function filterRules(rules, predicate) {
  const result = {};
  for (const key in rules) {
    if (has(rules, key) && predicate(rules[key])) {
      result[key] = rules[key];
    }
  }
  return result;
}

function configureAsError(rules) {
  const result = {};
  for (const key in rules) {
    if (!has(rules, key)) {
      continue;
    }
    result[`inferno/${key}`] = 2;
  }
  return result;
}

const activeRules = filterRules(allRules, rule => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, rule => rule.meta.deprecated);

module.exports = {
  deprecatedRules: deprecatedRules,
  rules: allRules,
  configs: {
    recommended: {
      plugins: [
        'inferno'
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'inferno/jsx-key': 2,
        'inferno/jsx-no-comment-textnodes': 2,
        'inferno/jsx-no-duplicate-props': 2,
        'inferno/jsx-no-target-blank': 2,
        'inferno/jsx-no-undef': 2,
        'inferno/jsx-uses-vars': 2,
        'inferno/no-children-prop': 2,
        'inferno/no-danger-with-children': 2,
        'inferno/no-direct-mutation-state': 2,
        'inferno/no-find-dom-node': 2,
        'inferno/no-is-mounted': 2,
        'inferno/no-render-return-value': 2,
        'inferno/no-string-refs': 2,
        'inferno/no-unescaped-entities': 2,
        'inferno/no-unknown-property': 2,
        'inferno/require-render-return': 2
      }
    },
    all: {
      plugins: [
        'inferno'
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: activeRulesConfig
    }
  }
};
