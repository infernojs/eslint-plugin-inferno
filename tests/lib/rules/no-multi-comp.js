/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-multi-comp');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-multi-comp', rule, {

  valid: [{
    code: [
      'var Hello = require(\'./components/Hello\');',
      'var HelloJohn = createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\r')
  }, {
    code: [
      'var Heading = createClass({',
      '  render: function() {',
      '    return (',
      '      <div>',
      '        {this.props.buttons.map(function(button, index) {',
      '          return <Button {...button} key={index}/>;',
      '        })}',
      '      </div>',
      '    );',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    options: [{
      ignoreStateless: true
    }]
  }, {
    // multiple non-components
    code: [
      'import Inferno, { createElement } from "inferno"',
      'const helperFoo = () => {',
      '  return true;',
      '};',
      'function helperBar() {',
      '  return false;',
      '};',
      'function RealComponent() {',
      '  return createElement("img");',
      '};'
    ].join('\n'),
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
  }, {
    code: `
      const Hello = Inferno.memo(function(props) {
        return <div>Hello {props.name}</div>;
      });
      class HelloJohn extends Inferno.Component {
        render() {
          return <Hello name="John" />;
        }
      }
    `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef((props, ref) => <StoreListItem {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef((props, ref) => {
    return <StoreListItem {...props} forwardRef={ref} />
  });
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  export default Inferno.forwardRef((props, ref) => <HelloComponent {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef(
    function myFunction(props, ref) {
      return <StoreListItem {...props} forwardedRef={ref} />;
    }
  );
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef((props, ref) => <StoreListItem {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef((props, ref) => {
    return <StoreListItem {...props} forwardRef={ref} />
  });
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  export default Inferno.forwardRef((props, ref) => <HelloComponent {...props} forwardRef={ref} />);
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef(
    function myFunction(props, ref) {
      return <StoreListItem {...props} forwardedRef={ref} />;
    }
  );
  `,
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  export default Inferno.memo((props, ref) => <HelloComponent {...props} />);
  `,
    options: [{
      ignoreStateless: false
    }]
  }, {
    code: `
      import Inferno from 'inferno';
      function memo() {
        var outOfScope = "hello"
        return null;
      }
      class ComponentY extends Inferno.Component {
        memoCities = memo((cities) => cities.map((v) => ({ label: v })));
        render() {
          return (
            <div>
              <div>Counter</div>
            </div>
          );
        }
      }
    `,
    parser: parsers.BABEL_ESLINT
  }],

  invalid: [{
    code: [
      'var Hello = createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});',
      'var HelloJohn = createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: [
      'class Hello extends Inferno.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'class HelloJohn extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}',
      'class HelloJohnny extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="Johnny" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }, {
      messageId: 'onlyOneComponent',
      line: 11
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
      line: 4
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends Inferno.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      messageId: 'onlyOneComponent',
      line: 4
    }]
  }, {
    code: [
      'export default {',
      '  renderHello(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  },',
      '  renderHello2(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  },
  {
    code: `
      exports.Foo = function Foo() {
        return <></>
      }

      exports.createSomeComponent = function createSomeComponent(opts) {
        return function Foo() {
          return <>{opts.a}</>
        }
      }
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
      line: 7
    }]
  },
  {
    code: `
  class StoreListItem extends Inferno.PureComponent {
    // A bunch of stuff here
  }
  export default Inferno.forwardRef((props, ref) => <div><StoreListItem {...props} forwardRef={ref} /></div>);
  `,
    options: [{
      ignoreStateless: false
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
      line: 5
    }]
  }, {
    code: `
  const HelloComponent = (props) => {
    return <div></div>;
  }
  const HelloComponent2 = Inferno.forwardRef((props, ref) => <div></div>);
  `,
    options: [{
      ignoreStateless: false
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
      line: 5
    }]
  }, {
    code: `
  const HelloComponent = (0, (props) => {
    return <div></div>;
  });
  const HelloComponent2 = Inferno.forwardRef((props, ref) => <><HelloComponent></HelloComponent></>);
  `,
    options: [{
      ignoreStateless: false
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      messageId: 'onlyOneComponent',
      line: 5
    }]
  }, {
    code: `
      const forwardRef = Inferno.forwardRef;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const memo = Inferno.memo;
      const HelloComponent = (props) => {
        return <div></div>;
      };
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const {forwardRef} = Inferno;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const {memo} = Inferno;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      import Inferno, { memo } from 'inferno';
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      import {forwardRef} from 'inferno';
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const { memo } = require('inferno');
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const {forwardRef} = require('inferno');
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const forwardRef = require('inferno').forwardRef;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
      const memo = require('inferno').memo;
      const HelloComponent = (0, (props) => {
        return <div></div>;
      });
      const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
    `,
    options: [{
      ignoreStateless: false
    }],
    errors: [{
      messageId: 'onlyOneComponent',
      line: 6
    }]
  }, {
    code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Text = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        })
        const Label = memo(() => <Text />);
      `,
    settings: {
      inferno: {
        pragma: 'Foo'
      }
    },
    errors: [{messageId: 'onlyOneComponent'}]
  }]
});
