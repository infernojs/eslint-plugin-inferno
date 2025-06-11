/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-unknown-property');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-unknown-property', rule, {
  valid: parsers.all([
    // Inferno optimization flags should be fine
    { code: '<div $HasKeyedChildren />;' },
    { code: '<div $HasNonKeyedChildren />;' },
    { code: '<div $HasVNodeChildren />;' },
    { code: '<div $HasTextChildren />;' },
    { code: '<div $ReCreate />;' },
    { code: '<div $ChildFlag="{1}" />;' },
    { code: '<div $Flags="{1}" />;' },

    { code: '<App onComponentWillMount={foo} />;' },
    { code: '<App onComponentDidMount={foo} />;' },
    { code: '<App onComponentDidAppear={foo} />;' },
    { code: '<App onComponentShouldUpdate={foo} />;' },
    { code: '<App onComponentWillUpdate={foo} />;' },
    { code: '<App onComponentDidUpdate={foo} />;' },
    { code: '<App onComponentWillUnmount={foo} />;' },
    { code: '<App onComponentWillDisappear={foo} />;' },
    { code: '<App onComponentWillMove={foo} />;' },

    { code: '<select selectedIndex={1} />;' },

    // Inferno components and their props/attributes should be fine
    { code: '<App class="bar" />;' },
    { code: '<App for="bar" />;' },
    { code: '<App someProp="bar" />;' },
    { code: '<Foo.bar for="bar" />;' },
    { code: '<App accept-charset="bar" />;' },
    { code: '<App http-equiv="bar" />;' },
    {
      code: '<App xlink:href="bar" />;',
      features: ['jsx namespace'],
    },
    { code: '<App clip-path="bar" />;' },
    {
      code: '<App dataNotAnDataAttribute="yes" />;',
      options: [{ requireDataLowercase: true }],
    },
    // Some HTML/DOM elements with common attributes should work
    { code: '<div className="bar"></div>;' },
    { code: '<div onMouseDown={this._onMouseDown}></div>;' },
    { code: '<a href="someLink" download="foo">Read more</a>' },
    { code: '<area download="foo" />' },
    { code: '<img src="cat_keyboard.jpeg" alt="A cat sleeping on a keyboard" align="top" fetchPriority="high" />' },
    { code: '<input type="password" required />' },
    { code: '<input ref={this.input} type="radio" />' },
    { code: '<div inert children="anything" />' },
    { code: '<iframe scrolling="?" onLoad={a} onError={b} align="top" />' },
    { code: '<input key="bar" type="radio" />' },
    { code: '<button disabled>You cannot click me</button>;' },
    { code: '<svg key="lock" viewbox="box" fill={10} d="d" stroke={1} stroke-width={2} stroke-linecap={3} stroke-linejoin={4} transform="something" clip-rule="else" x1={5} x2="6" y1="7" y2="8"></svg>' },
    { code: '<g fill="#7B82A0" fill-rule="evenodd"></g>' },
    { code: '<mask fill="#7B82A0"></mask>' },
    { code: '<symbol fill="#7B82A0"></symbol>' },
    { code: '<meta property="og:type" content="website" />' },
    { code: '<input type="checkbox" checked={checked} disabled={disabled} id={id} onChange={onChange} />' },
    { code: '<video playsinline />' },
    { code: '<img onError={foo} onLoad={bar} />' },
    { code: '<picture inert={false} onError={foo} onLoad={bar} />' },
    { code: '<iframe onError={foo} onLoad={bar} />' },
    { code: '<script onLoad={bar} onError={foo} />' },
    { code: '<source onLoad={bar} onError={foo} />' },
    { code: '<link onLoad={bar} onError={foo} />' },
    { code: '<link rel="preload" as="image" href="someHref" imagesrcset="someImageSrcSet" imagesizes="someImageSizes" />' },
    { code: '<object onLoad={bar} />' },
    { code: '<body onLoad={bar} />' },
    { code: '<video allowFullScreen webkitAllowFullScreen mozAllowFullScreen />' },
    { code: '<iframe allowFullScreen webkitAllowFullScreen mozAllowFullScreen />' },
    { code: '<table border="1" />' },
    { code: '<th abbr="abbr" />' },
    { code: '<td abbr="abbr" />' },
    { code: '<template shadowrootmode="open" shadowrootclonable shadowrootdelegatesfocus shadowrootserializable />' },
    { code: '<input type="checkbox" defaultChecked={this.state.checkbox} />' },
    { code: '<div onTouchStart={this.startAnimation} onTouchEnd={this.stopAnimation} onTouchCancel={this.cancel} onTouchMove={this.move} onMouseMoveCapture={this.capture} onTouchCancelCapture={this.log} />' },
    // {
    //   code: '<link precedence="medium" href="https://foo.bar" rel="canonical" />',
    // },
    // Case ignored attributes, for `charset` discussion see https://github.com/jsx-eslint/eslint-plugin-react/pull/1863
    { code: '<meta charset="utf-8" />;' },
    { code: '<meta charSet="utf-8" />;' },
    // Some custom web components that are allowed to use `class` instead of `className`
    { code: '<div class="foo" is="my-elem"></div>;' },
    { code: '<div {...this.props} class="foo" is="my-elem"></div>;' },
    { code: '<atom-panel class="foo"></atom-panel>;' },
    // data-* attributes should work
    { code: '<div data-foo="bar"></div>;' },
    { code: '<div data-foo-bar="baz"></div>;' },
    { code: '<div data-parent="parent"></div>;' },
    { code: '<div data-index-number="1234"></div>;' },
    { code: '<div data-e2e-id="5678"></div>;' },
    { code: '<div data-testID="bar" data-under_sCoRe="bar" />;' },
    {
      code: '<div data-testID="bar" data-under_sCoRe="bar" />;',
      options: [{ requireDataLowercase: false }],
    },
    // Ignoring should work
    {
      code: '<div class="bar"></div>;',
      options: [{ ignore: ['class'] }],
    },
    {
      code: '<div someProp="bar"></div>;',
      options: [{ ignore: ['someProp'] }],
    },
    {
      code: '<div css={{flex: 1}}></div>;',
      options: [{ ignore: ['css'] }],
    },

    // aria-* attributes should work
    { code: '<button aria-haspopup="true">Click me to open pop up</button>;' },
    { code: '<button aria-label="Close" onClick={someThing.close} />;' },
    // Attributes on allowed elements should work
    { code: '<script crossorigin nomodule />' },
    { code: '<script crossOrigin noModule />' },
    { code: '<audio crossOrigin />' },
    { code: '<svg focusable><image crossOrigin /></svg>' },
    { code: '<audio crossorigin />' },
    { code: '<svg focusable><image crossorigin /></svg>' },
    { code: '<details onToggle={this.onToggle}>Some details</details>' },
    { code: '<path fill="pink" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"></path>' },
    { code: '<line fill="pink" x1="0" y1="80" x2="100" y2="20"></line>' },
    { code: '<link as="audio">Audio content</link>' },
    { code: '<video controlsList="nodownload" controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} onResize={this.onResize}></video>' },
    { code: '<audio controlsList="nodownload" controls={this.controls} crossOrigin="anonymous" disableRemotePlayback loop muted preload="none" src="something" onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error} onResize={this.onResize}></audio>' },
    { code: '<marker id={markerId} viewBox="0 0 2 2" refX="1" refY="1" markerWidth="1" markerHeight="1" orient="auto" />' },
    { code: '<pattern id="pattern" viewBox="0,0,10,10" width="10%" height="10%" />' },
    { code: '<symbol id="myDot" width="10" height="10" viewBox="0 0 2 2" />' },
    { code: '<view id="one" viewBox="0 0 100 100" />' },
    { code: '<video controlslist="nodownload" controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsinline={true} onResize={this.onResize}></video>' },
    { code: '<audio controlslist="nodownload" controls={this.controls} crossorigin="anonymous" disableremoteplayback loop muted preload="none" src="something" onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error} onResize={this.onResize}></audio>' },
    { code: '<marker id={markerId} viewbox="0 0 2 2" refX="1" refY="1" markerWidth="1" markerHeight="1" orient="auto" />' },
    { code: '<pattern id="pattern" viewbox="0,0,10,10" width="10%" height="10%" />' },
    { code: '<symbol id="myDot" width="10" height="10" viewbox="0 0 2 2" />' },
    { code: '<view id="one" viewbox="0 0 100 100" />' },
    { code: '<hr align="top" />' },
    { code: '<applet align="top" />' },
    { code: '<marker fill="#000" />' },
    { code: '<dialog onClose={handler} open id="dialog" returnValue="something" onCancel={handler2} />' },
    {
      code: `
        <table align="top">
          <caption align="top">Table Caption</caption>
          <colgroup valign="top" align="top">
            <col valign="top" align="top"/>
          </colgroup>
          <thead valign="top" align="top">
            <tr valign="top" align="top">
              <th valign="top" align="top">Header</th>
              <td valign="top" align="top">Cell</td>
            </tr>
          </thead>
          <tbody valign="top" align="top" />
          <tfoot valign="top" align="top" />
        </table>
      `,
    },

    // fbt
    { code: '<fbt desc="foo" doNotExtract />;' },
    // fbs
    { code: '<fbs desc="foo" doNotExtract />;' },
    { code: '<math displaystyle="true" />;' },
    {
      code: `
        <div className="App" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash="customValue">
          Hello, world!
        </div>
      `,
    },
    {
      code: `
        <div>
          <button popovertarget="my-popover" popovertargetaction="toggle">Open Popover</button>

          <div popover id="my-popover">Greetings, one and all!</div>
        </div>
      `,
    },
    {
      code: `
        <div>
          <button popoverTarget="my-popover" popoverTargetAction="toggle">Open Popover</button>

          <div id="my-popover" onBeforeToggle={this.onBeforeToggle} popover>Greetings, one and all!</div>
        </div>
      `,
    },
    {
      code: '<rect clip-path="bar" transform-origin="center" />;',
    },
  ]),
  invalid: parsers.all([
    {
      code: '<div selectedIndex={foo} />;',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'selectedIndex',
            tagName: 'div',
            allowedTags: 'select',
          },
        },
      ],
    },
    {
      code: '<div onComponentWillMount={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentWillMount',
          },
        },
      ],
    },
    {
      code: '<div onComponentDidMount={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentDidMount',
          },
        },
      ],
    },
    {
      code: '<div onComponentDidAppear={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentDidAppear',
          },
        },
      ],
    },
    {
      code: '<div onComponentShouldUpdate={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentShouldUpdate',
          },
        },
      ],
    },
    {
      code: '<div onComponentWillUpdate={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentWillUpdate',
          },
        },
      ],
    },
    {
      code: '<div onComponentDidUpdate={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentDidUpdate',
          },
        },
      ],
    },
    {
      code: '<div onComponentWillUnmount={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentWillUnmount',
          },
        },
      ],
    },
    {
      code: '<div onComponentWillDisappear={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentWillDisappear',
          },
        },
      ],
    },
    {
      code: '<div onComponentWillMove={foo} />;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'onComponentWillMove',
          },
        },
      ],
    },
    {
      code: '<div allowTransparency="true" />',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'allowTransparency',
          },
        },
      ],
    },
    {
      code: '<div hasOwnProperty="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'hasOwnProperty',
          },
        },
      ],
    },
    {
      code: '<div aria-fake="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'aria-fake',
          },
        },
      ],
    },
    {
      code: '<div someProp="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'someProp',
          },
        },
      ],
    },
    {
      code: '<div htmlfor="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'htmlfor',
          },
        },
      ],
    },
    // Another rule checks class/className usages
    // {
    //   code: '<div class="bar"></div>;',
    //   output: '<div className="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'class',
    //         standardName: 'className',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div htmlFor="bar"></div>;',
    //   output: '<div for="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'htmlFor',
    //         standardName: 'for',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div acceptCharset="bar"></div>;',
    //   output: '<div accept-charset="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'acceptCharset',
    //         standardName: 'accept-charset',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div httpEquiv="bar"></div>;',
    //   output: '<div http-equiv="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'httpEquiv',
    //         standardName: 'http-equiv',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div accessKey="bar"></div>;',
    //   output: '<div accesskey="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'accessKey',
    //         standardName: 'accesskey',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div onclick="bar"></div>;',
    //   output: '<div onClick="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'onclick',
    //         standardName: 'onClick',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div onmousedown="bar"></div>;',
    //   output: '<div onMouseDown="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'onmousedown',
    //         standardName: 'onMouseDown',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<div onMousedown="bar"></div>;',
    //   output: '<div onMouseDown="bar"></div>;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'onMousedown',
    //         standardName: 'onMouseDown',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<use xlinkHref="bar" />;',
    //   output: '<use xlink:href="bar" />;',
    //   features: ['jsx namespace'],
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'xlinkHref',
    //         standardName: 'xlink:href',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<rect clipPath="bar" />;',
    //   output: '<rect clip-path="bar" />;',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'clipPath',
    //         standardName: 'clip-path',
    //       },
    //     },
    //   ],
    // },
    // {
    //   code: '<script crossOrigin nomodule />',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'crossOrigin',
    //         standardName: 'crossorigin',
    //       },
    //     },
    //   ],
    //   output: '<script crossorigin nomodule />',
    // },
    // {
    //   code: '<div crossOrigin />',
    //   errors: [
    //     {
    //       messageId: 'unknownPropWithReactName',
    //       data: {
    //         name: 'crossOrigin',
    //         standardName: 'crossorigin',
    //       },
    //     },
    //   ],
    //   output: '<div crossorigin />',
    // },
    // {
    //   code: '<div crossorigin />',
    //   errors: [
    //     {
    //       messageId: 'invalidPropOnTag',
    //       data: {
    //         name: 'crossorigin',
    //         tagName: 'div',
    //         allowedTags: 'script, img, video, audio, link, image',
    //       },
    //     },
    //   ],
    // },
    {
      code: '<div as="audio" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'as',
            tagName: 'div',
            allowedTags: 'link',
          },
        },
      ],
    },
    {
      code: '<div onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onResize={this.resize} onError={this.error} />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onAbort',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onDurationChange',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onEmptied',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onEnded',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onResize',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onError',
            tagName: 'div',
            allowedTags: 'audio, video, img, link, source, script, picture, iframe',
          },
        },
      ],
    },
    {
      code: '<div onLoad={this.load} />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'onLoad',
            tagName: 'div',
            allowedTags: 'script, img, link, picture, iframe, object, source, body',
          },
        },
      ],
    },
    {
      code: '<div fill="pink" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'fill',
            tagName: 'div',
            allowedTags: 'altGlyph, circle, ellipse, g, line, marker, mask, path, polygon, polyline, rect, svg, symbol, text, textPath, tref, tspan, use, animate, animateColor, animateMotion, animateTransform, set',
          },
        },
      ],
    },
    {
      code: '<div controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsinline={true} allowfullscreen></div>',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'controls',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'loop',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'muted',
            tagName: 'div',
            allowedTags: 'audio, video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'playsinline',
            tagName: 'div',
            allowedTags: 'video',
          },
        },
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'allowfullscreen',
            tagName: 'div',
            allowedTags: 'iframe, video',
          },
        },
      ],
    },
    {
      code: '<div download="foo" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'download',
            tagName: 'div',
            allowedTags: 'a, area',
          },
        },
      ],
    },
    {
      code: '<div imagesrcset="someImageSrcSet" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'imagesrcset',
            tagName: 'div',
            allowedTags: 'link',
          },
        },
      ],
    },
    {
      code: '<div imagesizes="someImageSizes" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'imagesizes',
            tagName: 'div',
            allowedTags: 'link',
          },
        },
      ],
    },
    {
      code: '<div data-xml-anything="invalid" />',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'data-xml-anything',
          },
        },
      ],
    },
    {
      code: '<div data-testID="bar" data-under_sCoRe="bar" dataNotAnDataAttribute="yes" />;',
      errors: [
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-testID',
            lowerCaseName: 'data-testid',
          },
        },
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-under_sCoRe',
            lowerCaseName: 'data-under_score',
          },
        },
        {
          messageId: 'unknownProp',
          data: {
            name: 'dataNotAnDataAttribute',
            lowerCaseName: 'datanotandataattribute',
          },
        },
      ],
      options: [{ requireDataLowercase: true }],
    },
    {
      code: '<App data-testID="bar" data-under_sCoRe="bar" dataNotAnDataAttribute="yes" />;',
      errors: [
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-testID',
            lowerCaseName: 'data-testid',
          },
        },
        {
          messageId: 'dataLowercaseRequired',
          data: {
            name: 'data-under_sCoRe',
            lowerCaseName: 'data-under_score',
          },
        },
      ],
      options: [{ requireDataLowercase: true }],
    },
    {
      code: '<div abbr="abbr" />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'abbr',
            tagName: 'div',
            allowedTags: 'th, td',
          },
        },
      ],
    },
    {
      code: `
        <div className="App" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c="customValue">
          Hello, world!
        </div>
      `,
      features: ['no-ts'],
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c',
          },
        },
      ],
    },
  ]),
});
