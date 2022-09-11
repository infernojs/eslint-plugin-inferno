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
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-multi-comp', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = require('./components/Hello');
        var HelloJohn = createClass({
          render: function() {
            return <Hello name="John" />;
          }
        });
      `,
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      code: `
        var Heading = createClass({
          render: function() {
            return (
              <div>
                {this.props.buttons.map(function(button, index) {
                  return <Button {...button} key={index}/>;
                })}
              </div>
            );
          }
        });
      `,
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        function HelloAgain(props) {
          return <div>Hello again {props.name}</div>;
        }
      `,
      options: [{ ignoreStateless: true }],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        class HelloJohn extends Inferno.Component {
          render() {
            return <Hello name="John" />;
          }
        }
      `,
      options: [{ ignoreStateless: true }],
    },
    {
    // multiple non-components
      code: `
        import Inferno, { createElement } from "inferno"
        const helperFoo = () => {
          return true;
        };
        function helperBar() {
          return false;
        };
        function RealComponent() {
          return createElement("img");
        };
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
    },
    {
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
      options: [{ ignoreStateless: true }],
    },
    {
      code: `
        class StoreListItem extends Inferno.PureComponent {
          // A bunch of stuff here
        }
        export default Inferno.forwardRef((props, ref) => <StoreListItem {...props} forwardRef={ref} />);
      `,
      options: [{ ignoreStateless: false }],
    },
    {
      code: `
        class StoreListItem extends Inferno.PureComponent {
          // A bunch of stuff here
        }
        export default Inferno.forwardRef((props, ref) => {
          return <StoreListItem {...props} forwardRef={ref} />
        });
      `,
      options: [{ ignoreStateless: false }],
    },
    {
      code: `
        const HelloComponent = (props) => {
          return <div></div>;
        }
        export default Inferno.forwardRef((props, ref) => <HelloComponent {...props} forwardRef={ref} />);
      `,
      options: [{ ignoreStateless: false }],
    },
    {
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
      options: [{ ignoreStateless: true }],
    },
    {
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
      options: [{ ignoreStateless: true }],
    },
    {
      code: `
        const HelloComponent = (props) => {
          return <div></div>;
        }
        export default Inferno.memo((props, ref) => <HelloComponent {...props} />);
      `,
      options: [{ ignoreStateless: true }],
    },
    {
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
      features: ['class fields'],
    },
    {
      code: `
        const MenuList = forwardRef(({onClose, ...props}, ref) => {
          const {t} = useTranslation();
          const handleLogout = useLogoutHandler();

          const onLogout = useCallback(() => {
            onClose();
            handleLogout();
          }, [onClose, handleLogout]);

          return (
            <MuiMenuList ref={ref} {...props}>
              <MuiMenuItem key="logout" onClick={onLogout}>
                {t('global-logout')}
              </MuiMenuItem>
            </MuiMenuList>
          );
        });

        MenuList.displayName = 'MenuList';

        MenuList.propTypes = {
          onClose: PropTypes.func,
        };

        MenuList.defaultProps = {
          onClose: () => null,
        };

        export default MenuList;
      `,
    },
    {
      code: `
        const MenuList = forwardRef(({ onClose, ...props }, ref) => {
          const onLogout = useCallback(() => {
            onClose()
          }, [onClose])

          return (
            <BlnMenuList ref={ref} {...props}>
              <BlnMenuItem key="logout" onClick={onLogout}>
                Logout
              </BlnMenuItem>
            </BlnMenuList>
          )
        })

        MenuList.displayName = 'MenuList'

        MenuList.propTypes = {
          onClose: PropTypes.func
        }

        MenuList.defaultProps = {
          onClose: () => null
        }

        export default MenuList
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
        var HelloJohn = createClass({
          render: function() {
            return <Hello name="John" />;
          }
        });
      `.split('\n').join('\r'),
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
      ],
    },
    {
      code: `
        class Hello extends Inferno.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        class HelloJohn extends Inferno.Component {
          render() {
            return <Hello name="John" />;
          }
        }
        class HelloJohnny extends Inferno.Component {
          render() {
            return <Hello name="Johnny" />;
          }
        }
      `.split('\n').join('\r'),
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
        {
          messageId: 'onlyOneComponent',
          line: 12,
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        function HelloAgain(props) {
          return <div>Hello again {props.name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        class HelloJohn extends Inferno.Component {
          render() {
            return <Hello name="John" />;
          }
        }
      `,
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        export default {
          RenderHello(props) {
            let {name} = props;
            return <div>{name}</div>;
          },
          RenderHello2(props) {
            let {name} = props;
            return <div>{name}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
      ],
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
      features: ['fragment'],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 7,
        },
      ],
    },
    {
      code: `
        class StoreListItem extends Inferno.PureComponent {
          // A bunch of stuff here
        }
        export default Inferno.forwardRef((props, ref) => <div><StoreListItem {...props} forwardRef={ref} /></div>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        const HelloComponent = (props) => {
          return <div></div>;
        }
        const HelloComponent2 = Inferno.forwardRef((props, ref) => <div></div>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = Inferno.forwardRef((props, ref) => <><HelloComponent></HelloComponent></>);
      `,
      options: [{ ignoreStateless: false }],
      features: ['fragment'],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 5,
        },
      ],
    },
    {
      code: `
        const forwardRef = Inferno.forwardRef;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const memo = Inferno.memo;
        const HelloComponent = (props) => {
          return <div></div>;
        };
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const {forwardRef} = Inferno;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const {memo} = Inferno;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Inferno, { memo } from 'inferno';
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        import {forwardRef} from 'inferno';
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const { memo } = require('inferno');
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const {forwardRef} = require('inferno');
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const forwardRef = require('inferno').forwardRef;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = forwardRef((props, ref) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        const memo = require('inferno').memo;
        const HelloComponent = (0, (props) => {
          return <div></div>;
        });
        const HelloComponent2 = memo((props) => <HelloComponent></HelloComponent>);
      `,
      options: [{ ignoreStateless: false }],
      errors: [
        {
          messageId: 'onlyOneComponent',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Text = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        })
        const Label = memo(() => <Text />);
      `,
      settings: {
        inferno: {
          pragma: 'Foo',
        },
      },
      errors: [{ messageId: 'onlyOneComponent' }],
    },
  ]),
});
