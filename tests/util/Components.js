'use strict';

const assert = require('assert');
const entries = require('object.entries');
const eslint = require('eslint');
const fromEntries = require('object.fromentries');
const values = require('object.values');

const Components = require('../../lib/util/Components');
const parsers = require('../helpers/parsers');

const ruleTester = new eslint.RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

describe('Components', () => {
  describe('static detect', () => {
    function testComponentsDetect(test, instructionsOrDone, orDone) {
      const done = orDone || instructionsOrDone;
      const instructions = orDone ? instructionsOrDone : instructionsOrDone;

      const rule = {
        create: Components.detect((_context, components, util) => {
          const instructionResults = [];

          const augmentedInstructions = fromEntries(
            entries(instructions || {}).map((nodeTypeAndHandler) => {
              const nodeType = nodeTypeAndHandler[0];
              const handler = nodeTypeAndHandler[1];
              return [nodeType, (node) => {
                instructionResults.push({ type: nodeType, result: handler(node, context, components, util) });
              }];
            }),
          );

          return {
            ...augmentedInstructions,
            'Program:exit'(node) {
              if (augmentedInstructions['Program:exit']) {
                augmentedInstructions['Program:exit'](node, context, components, util);
              }
              done(components, instructionResults);
            },
          };
        }),
      };

      const tests = {
        valid: parsers.all([{
          ...test,
          settings: {
            inferno: {
              version: 'detect',
            },
          },
        }]),
        invalid: [],
      };

      ruleTester.run(test.code, rule, tests);
    }

    it('should detect Stateless Function Component', () => {
      testComponentsDetect({
        code: `import Inferno from 'inferno'
          function MyStatelessComponent() {
            return <Inferno.Fragment />;
          }`,
      }, (components) => {
        assert.equal(components.length(), 1, 'MyStatelessComponent should be detected component');
        values(components.list()).forEach((component) => {
          assert.equal(
            component.node.id.name,
            'MyStatelessComponent',
            'MyStatelessComponent should be detected component',
          );
        });
      });
    });

    it('should detect Class Components', () => {
      testComponentsDetect({
        code: `import Inferno from 'inferno'
        class MyClassComponent extends Inferno.Component {
          render() {
            return <Inferno.Fragment />;
          }
        }`,
      }, (components) => {
        assert(components.length() === 1, 'MyClassComponent should be detected component');
        values(components.list()).forEach((component) => {
          assert.equal(
            component.node.id.name,
            'MyClassComponent',
            'MyClassComponent should be detected component',
          );
        });
      });
    });

    it('should detect Inferno Imports', () => {
      testComponentsDetect({
        code: 'import Inferno, { useCallback, useState } from \'inferno\'',
      }, (components) => {
        assert.deepEqual(
          components.getDefaultInfernoImports().map((specifier) => specifier.local.name),
          ['Inferno'],
          'default Inferno import identifier should be "Inferno"',
        );

        assert.deepEqual(
          components.getNamedInfernoImports().map((specifier) => specifier.local.name),
          ['useCallback', 'useState'],
          'named Inferno import identifiers should be "useCallback" and "useState"',
        );
      });
    });

    describe('testComponentsDetect', () => {
      it('should log Program:exit instruction', () => {
        testComponentsDetect({
          code: '',
        }, {
          'Program:exit': () => true,
        }, (_components, instructionResults) => {
          assert.deepEqual(instructionResults, [{ type: 'Program:exit', result: true }]);
        });
      });
    });
  });
});
