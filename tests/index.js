/* eslint-env mocha */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');

const ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map((f) => path.basename(f, '.js'));

describe('all rule files should be exported by the plugin', () => {
  ruleFiles.forEach((ruleName) => {
    it(`should export ${ruleName}`, () => {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName)) // eslint-disable-line global-require, import/no-dynamic-require
      );
    });
  });
});

describe('deprecated rules', () => {
  it('marks all deprecated rules as deprecated', () => {
    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const isDeprecated = plugin.rules[ruleName].meta.deprecated;
      if (inDeprecatedRules) {
        assert(isDeprecated, `${ruleName} metadata should mark it as deprecated`);
      } else {
        assert(!isDeprecated, `${ruleName} metadata should not mark it as deprecated`);
      }
    });
  });
});

describe('configurations', () => {
  it('should export a ‘recommended’ configuration', () => {
    const configName = 'recommended';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('inferno/'));
      const subRuleName = ruleName.slice('inferno/'.length);
      assert(plugin.rules[subRuleName]);
    });

    ruleFiles.forEach((ruleName) => {
      const inRecommendedConfig = !!plugin.configs[configName].rules[`inferno/${ruleName}`];
      const isRecommended = plugin.rules[ruleName].meta.docs[configName];
      if (inRecommendedConfig) {
        assert(isRecommended, `${ruleName} metadata should mark it as recommended`);
      } else {
        assert(!isRecommended, `${ruleName} metadata should not mark it as recommended`);
      }
    });
  });

  it('should export an ‘all’ configuration', () => {
    const configName = 'all';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('inferno/'));
      assert.equal(plugin.configs[configName].rules[ruleName], 2);
    });

    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inConfig = typeof plugin.configs[configName].rules[`inferno/${ruleName}`] !== 'undefined';
      assert(inDeprecatedRules ^ inConfig); // eslint-disable-line no-bitwise
    });
  });
});
