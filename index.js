'use strict';

const allRules = require('./lib/rules');

// TODO: with TS 4.5+, inline this
const SEVERITY_ERROR = /** @type {2} */ (2);
// const SEVERITY_OFF = /** @type {0} */ (0);

function filterRules(rules, predicate) {
  return Object.fromEntries(Object.entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, SEVERITY_ERROR | 'error'>}
 */
function configureAsError(rules) {
  return Object.fromEntries(Object.keys(rules).map((key) => [`inferno/${key}`, SEVERITY_ERROR]));
}

/** @type {Partial<typeof allRules>} */
const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
/** @type {Record<keyof typeof activeRules, 2 | 'error'>} */
const activeRulesConfig = configureAsError(activeRules);

/** @type {Partial<typeof allRules>} */
const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

/** @type {['inferno']} */
// for legacy config system
const plugins = [
  'inferno',
];

const configs = {
  recommended: {
    plugins,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      'inferno/jsx-key': SEVERITY_ERROR,
      'inferno/jsx-no-comment-textnodes': SEVERITY_ERROR,
      'inferno/jsx-no-duplicate-props': SEVERITY_ERROR,
      'inferno/jsx-no-target-blank': SEVERITY_ERROR,
      'inferno/jsx-no-undef': SEVERITY_ERROR,
      'inferno/jsx-uses-vars': SEVERITY_ERROR,
      'inferno/no-children-prop': SEVERITY_ERROR,
      'inferno/no-danger-with-children': SEVERITY_ERROR,
      'inferno/no-direct-mutation-state': SEVERITY_ERROR,
      'inferno/no-find-dom-node': SEVERITY_ERROR,
      'inferno/no-is-mounted': SEVERITY_ERROR,
      'inferno/no-render-return-value': SEVERITY_ERROR,
      'inferno/no-string-refs': SEVERITY_ERROR,
      'inferno/no-unescaped-entities': SEVERITY_ERROR,
      'inferno/no-unknown-property': SEVERITY_ERROR,
      'inferno/require-render-return': SEVERITY_ERROR,
    },
  },
  all: {
    plugins,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: activeRulesConfig,
  },
  flat: /** @type {Record<string, InfernoFlatConfig>} */ ({
    __proto__: null,
  }),
};

/** @typedef {{ plugins: { inferno: typeof plugin }, rules: import('eslint').Linter.RulesRecord, languageOptions: { parserOptions: import('eslint').Linter.ParserOptions } }} InfernoFlatConfig */

/** @type {{ deprecatedRules: typeof deprecatedRules, rules: typeof allRules, configs: typeof configs & { flat: Record<string, InfernoFlatConfig> }}} */
const plugin = {
  deprecatedRules,
  rules: allRules,
  configs,
};

Object.assign(configs.flat, {
  recommended: {
    plugins: { inferno: plugin },
    rules: configs.recommended.rules,
    languageOptions: { parserOptions: configs.recommended.parserOptions },
  },
  all: {
    plugins: { inferno: plugin },
    rules: configs.all.rules,
    languageOptions: { parserOptions: configs.all.parserOptions },
  },
});

module.exports = plugin;
