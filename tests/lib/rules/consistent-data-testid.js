'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/consistent-data-testid');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('consistent-data-testid', rule, {
  valid: [
    {
      code: `
          import React from 'react';
          
          const TestComponent = props => {
            return (
              <div data-testid="cool">
                Hello
              </div>
            )
          };
        `,
      options: [{ testIdPattern: 'cool' }],
    },
    {
      code: `
          import React from 'react';
          
          const TestComponent = props => {
            return (
              <div className="cool">
                Hello
              </div>
            )
          };
        `,
      options: [{ testIdPattern: 'cool' }],
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="Awesome__CoolStuff">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '^{fileName}(__([A-Z]+[a-z]*?)+)*$',
        },
      ],
      filename: '/my/cool/file/path/Awesome.js',
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="Awesome">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '^{fileName}(__([A-Z]+[a-z]*?)+)*$',
        },
      ],
      filename: '/my/cool/file/path/Awesome.js',
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="Parent">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '^{fileName}(__([A-Z]+[a-z]*?)+)*$',
        },
      ],
      filename: '/my/cool/file/Parent/index.js',
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="Parent">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '{fileName}',
        },
      ],
      filename: '/my/cool/__tests__/Parent/index.js',
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="wrong" custom-attr="right-1">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '^right(.*)$',
          testIdAttribute: 'custom-attr',
        },
      ],
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-test-id="Parent">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '{fileName}',
          testIdAttribute: 'data-test-id',
        },
      ],
      filename: '/my/cool/__tests__/Parent/index.js',
    },
    {
      code: `
          import React from 'react';
          
          const TestComponent = props => {
            const dynamicTestId = 'somethingDynamic';
            return (
              <div data-testid={\`cool-\${dynamicTestId}\`}>
                Hello
              </div>
            )
          };
        `,
      options: [{ testIdPattern: 'somethingElse' }],
    },
  ],
  invalid: [
    {
      code: `
        import React from 'react';
            
        const TestComponent = props => {
          return (
            <div data-testid="Awesome__CoolStuff">
              Hello
            </div>
          )
        };
        `,
      options: [{ testIdPattern: 'error' }],
      errors: [
        {
          message: '`data-testid` "Awesome__CoolStuff" should match `/error/`',
        },
      ],
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="Nope">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: 'matchMe',
        },
      ],
      filename: '/my/cool/__tests__/Parent/index.js',
      errors: [
        {
          message: '`data-testid` "Nope" should match `/matchMe/`',
        },
      ],
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="Parent__cool" my-custom-attr="WrongComponent__cool">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '^{fileName}(__([A-Z]+[a-z]*?)+)*$',
          testIdAttribute: 'my-custom-attr',
        },
      ],
      filename: '/my/cool/__tests__/Parent/index.js',
      errors: [
        {
          message:
            '`my-custom-attr` "WrongComponent__cool" should match `/^Parent(__([A-Z]+[a-z]*?)+)*$/`',
        },
      ],
    },
    {
      code: `
            import React from 'react';
            
            const TestComponent = props => {
              return (
                <div data-testid="WrongComponent__cool">
                  Hello
                </div>
              )
            };
          `,
      options: [
        {
          testIdPattern: '^{fileName}(__([A-Z]+[a-z]*?)+)*$',
        },
      ],
      filename: '/my/cool/__tests__/Parent/index.js',
      errors: [
        {
          message:
            '`data-testid` "WrongComponent__cool" should match `/^Parent(__([A-Z]+[a-z]*?)+)*$/`',
        },
      ],
    },
  ],
});
