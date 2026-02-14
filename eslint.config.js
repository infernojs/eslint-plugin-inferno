'use strict';

const eslintPlugin = require('eslint-plugin-eslint-plugin').default;
const importPlugin = require('eslint-plugin-import');

const airbnbBase = require('eslint-config-airbnb-base');
const airbnbBaseConfigs = airbnbBase.extends.map((configPath) => require(configPath));

const airbnbBaseRules = airbnbBaseConfigs.reduce((rules, config) => ({
  ...rules,
  ...(config.rules || {}),
}), {});

const airbnbBaseSettings = airbnbBaseConfigs.reduce((settings, config) => ({
  ...settings,
  ...(config.settings || {}),
}), {});

const nodeGlobals = {
  __dirname: 'readonly',
  __filename: 'readonly',
  console: 'readonly',
  exports: 'readonly',
  global: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
};

const mochaGlobals = {
  after: 'readonly',
  afterEach: 'readonly',
  before: 'readonly',
  beforeEach: 'readonly',
  context: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  specify: 'readonly',
  xcontext: 'readonly',
  xdescribe: 'readonly',
  xit: 'readonly',
  xspecify: 'readonly',
};

module.exports = [
  {
    name: 'global-ignores',
    ignores: [
      'coverage/',
      '.nyc_output/',
      'test-published-types/',
      'tests/fixtures/flat-config/',
      '**/*/*.d.ts',
    ],
  },

  // Legacy "airbnb-base" rules converted for flat config usage.
  {
    name: 'airbnb-base',
    plugins: {
      import: importPlugin,
    },
    settings: airbnbBaseSettings,
    rules: airbnbBaseRules,
  },

  // "plugin:eslint-plugin/recommended"
  eslintPlugin.configs.recommended,

  // Project defaults + overrides from the old `.eslintrc`
  {
    name: 'eslint-plugin-inferno',
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: nodeGlobals,
    },
    rules: {
      'comma-dangle': [2, 'always-multiline'],
      'object-shorthand': [2, 'always', {
        ignoreConstructors: false,
        avoidQuotes: false, // this is the override vs airbnb
      }],
      'max-len': [2, 140, {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
      'consistent-return': 0,

      'prefer-destructuring': [2, { array: false, object: false }, { enforceForRenamedProperties: false }],
      'function-call-argument-newline': 1, // TODO: enable
      'function-paren-newline': 0,
      'no-plusplus': 0,
      'no-param-reassign': 0,
      'no-restricted-syntax': 0,
      strict: [2, 'safe'],

      'eslint-plugin/consistent-output': 0,
      'eslint-plugin/no-meta-schema-default': 0,
      'eslint-plugin/require-meta-docs-description': [2, { pattern: '^(Enforce|Require|Disallow)' }],
      'eslint-plugin/require-meta-default-options': 0,
      'eslint-plugin/require-meta-schema-description': 0,
      'eslint-plugin/require-meta-schema': 0,
      'eslint-plugin/require-meta-type': 0,
      'eslint-plugin/no-unused-message-ids': 0,
      'eslint-plugin/prefer-output-null': 0,
      'eslint-plugin/prefer-message-ids': 0,
    },
  },

  {
    name: 'tests',
    files: ['tests/**'],
    languageOptions: {
      globals: mochaGlobals,
    },
    rules: {
      'no-template-curly-in-string': 1,
    },
  },

  // Allow dynamic requires + dev deps in this local config file.
  {
    name: 'eslint.config.js',
    files: ['eslint.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 0,
      'import/newline-after-import': 0,
      'import/no-dynamic-require': 0,
      'global-require': 0,
    },
  },
];
