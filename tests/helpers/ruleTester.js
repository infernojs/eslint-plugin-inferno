'use strict';

const ESLintRuleTester = require('eslint').RuleTester;
const semver = require('semver');
const eslintPkg = require('eslint/package.json');

function getSyntheticFilenameExtension(test) {
  if (!test || typeof test !== 'object') {
    return 'js';
  }

  const parser = typeof test.parser === 'string' ? test.parser : '';
  const code = typeof test.code === 'string' ? test.code : '';

  // Loose heuristic: enough for TS/TSX parsing mode in @typescript-eslint/parser.
  const looksLikeJsx = /<\s*\/|\/\s*>/u.test(code);

  if (parser.includes('@typescript-eslint/parser')) {
    return looksLikeJsx ? 'tsx' : 'ts';
  }

  if (parser.includes('@babel/eslint-parser') || parser.includes('babel-eslint')) {
    return looksLikeJsx ? 'jsx' : 'js';
  }

  return 'js';
}

function sanitizeTestCase(test, kind, { ruleName, index } = {}) {
  if (typeof test !== 'object' || test === null) {
    return test;
  }

  const sanitizedTest = { ...test };

  // ESLint v9+ (and some parsers) can use `filename` for parsing mode, and
  // ESLint v10 RuleTester can fail on duplicate test cases. Ensure each test
  // case has a stable, unique filename unless it explicitly provided one.
  if (!('filename' in sanitizedTest) && ruleName) {
    const extension = getSyntheticFilenameExtension(sanitizedTest);
    sanitizedTest.filename = `${ruleName}.${kind}.${index}.${extension}`;
  }

  if (semver.major(eslintPkg.version) < 10) {
    return sanitizedTest;
  }

  // ESLint v10 RuleTester is stricter:
  // - `type` in error objects is no longer supported.
  // - valid test cases can't contain `errors` or `output`.
  if (kind === 'valid') {
    delete sanitizedTest.errors;
    delete sanitizedTest.output;
  }

  if (kind === 'invalid' && Array.isArray(sanitizedTest.errors)) {
    sanitizedTest.errors = sanitizedTest.errors.map((error) => {
      if (typeof error !== 'object' || error === null) {
        return error;
      }

      // eslint-disable-next-line no-unused-vars -- strips the key for eslint v10+
      const { type, ...rest } = error;
      return rest;
    });
  }

  return sanitizedTest;
}

// `item` can be a config passed to the constructor, or a test case object/string
function convertToFlat(item, plugins) {
  if (typeof item === 'string') {
    return item;
  }

  if (typeof item !== 'object' || item === null) {
    throw new TypeError('Invalid value for "item" option. Expected an object or a string.');
  }

  const newItem = { ...item, languageOptions: {} };

  if (newItem.parserOptions) {
    newItem.languageOptions.parserOptions = newItem.parserOptions;

    if (newItem.parserOptions.ecmaVersion) {
      newItem.languageOptions.ecmaVersion = newItem.parserOptions.ecmaVersion;
    }

    if (newItem.parserOptions.sourceType) {
      newItem.languageOptions.sourceType = newItem.parserOptions.sourceType;
    }

    delete newItem.parserOptions;
  }

  if (newItem.parser) {
    newItem.languageOptions.parser = require(newItem.parser); // eslint-disable-line global-require, import/no-dynamic-require
    delete newItem.parser;
  }

  if (newItem.globals) {
    newItem.languageOptions.globals = newItem.globals;
    delete newItem.globals;
  }

  if (plugins) {
    newItem.plugins = plugins;
  }

  return newItem;
}

let RuleTester = ESLintRuleTester;

if (semver.major(eslintPkg.version) >= 9) {
  const PLUGINS = Symbol('eslint-plugin-inferno plugins');
  const RULE_DEFINER = Symbol.for('inferno.RuleTester.RuleDefiner');

  RuleTester = class extends ESLintRuleTester {
    constructor(config) {
      if ((typeof config !== 'object' && typeof config !== 'undefined') || config === null) {
        throw new TypeError('Invalid value for "config" option. Expected an object or undefined.');
      }

      const newConfig = convertToFlat(config || {});

      if (!newConfig.languageOptions.ecmaVersion) {
        newConfig.languageOptions.ecmaVersion = 5; // old default
      }

      if (!newConfig.languageOptions.sourceType) {
        newConfig.languageOptions.sourceType = 'script'; // old default
      }

      super(newConfig);

      this[RULE_DEFINER] = {
        defineRule: (ruleId, rule) => {
          if (!this[PLUGINS]) {
            this[PLUGINS] = {};
          }

          const ruleIdSplit = ruleId.split('/');

          if (ruleIdSplit.length !== 2) {
            throw new Error('ruleId should be in the format: plugin-name/rule-name');
          }

          const pluginName = ruleIdSplit[0];
          const ruleName = ruleIdSplit[1];

          if (!this[PLUGINS][pluginName]) {
            this[PLUGINS][pluginName] = { rules: {} };
          }

          this[PLUGINS][pluginName].rules[ruleName] = rule;
        },
      };
    }

    run(ruleName, rule, tests) {
      const newTests = {
        valid: tests.valid.map((test, index) => convertToFlat(sanitizeTestCase(test, 'valid', { ruleName, index }), this[PLUGINS])),
        invalid: tests.invalid.map((test, index) => convertToFlat(sanitizeTestCase(test, 'invalid', { ruleName, index }), this[PLUGINS])),
      };

      super.run(ruleName, rule, newTests);
    }
  };
}

module.exports = RuleTester;
