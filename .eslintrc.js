// @ts-check

/** @type { import('eslint').Linter.Config } */
const config = {
  extends: [
    'eslint:recommended', // https://eslint.org/docs/rules/
    'plugin:react/recommended', // https://github.com/jsx-eslint/eslint-plugin-react#list-of-supported-rules
    'plugin:@typescript-eslint/recommended', // https://typescript-eslint.io/rules/
    'react-app', // https://github.com/facebook/create-react-app/blob/main/packages/eslint-config-react-app/index.js
    'plugin:prettier/recommended', // See .prettierrc
  ],
  parser: '@typescript-eslint/parser',

  settings: {
    // Warn about <a target="_blank" rel="noopener"> in components other than "a"
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md#custom-link-components
    linkComponents: ['Button', 'MediaButton', 'SidebarButton', 'Anchor', 'Link', 'AnchorLink'],
  },
  reportUnusedDisableDirectives: true,

  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'redux-saga/effects',
            message: "Import 'typed-redux-saga' instead, and use matchers.select in tests.",
          },
          {
            name: '@reduxjs/toolkit',
            importNames: ['createSlice'],
            message: "Import 'utils/@reduxjs/toolkit' instead.",
          },
          {
            name: 'react-data-table-component',
            importNames: ['default', 'DataTable', 'IDataTableColumn', 'IDataTableProps'],
            message: "Import 'TypeSafeDataTable' instead.",
          },
          {
            name: 'grommet',
            message: "Import 'grommet/es6/*' instead.",
          },
          {
            name: 'grommet/es6/components',
            message: "Import 'grommet/es6/components/*' instead.",
          },
          {
            name: 'grommet-icons',
            message: "Import 'grommet-icons/es6/*' instead.",
          },
          {
            name: 'grommet-icons/es6/icons',
            message: "Import 'grommet-icons/es6/icons/*' instead.",
          },
        ],
        patterns: [
          {
            group: ['grommet/*', '!grommet/es6'],
            message: "Import 'grommet/es6/*' instead.",
          },
          {
            group: ['grommet-icons/*', '!grommet-icons/es6'],
            message: "Import 'grommet-icons/es6/*' instead.",
          },
        ],
      },
    ],
    'prefer-template': 'error',
    'no-restricted-syntax': [
      // Find google translate issues: https://github.com/facebook/react/issues/11538#issuecomment-390386520
      'error',

      // Ban `condition && text node`
      {
        selector:
          'JSXElement > JSXExpressionContainer > LogicalExpression[operator="&&"]' +
          '[right.type!="JSXElement"][right.type!="JSXFragment"]',
        message:
          'Conditional plain text nodes could break React if used with Google Translate. Wrap text into an element.',
      },
      // Ban `condition && <>text node</>`
      {
        selector:
          'JSXElement > JSXExpressionContainer > LogicalExpression[operator="&&"]' +
          ' > JSXFragment > .children:not(JSXElement, JSXText[value=/^\\s+$/])',
        message:
          'Conditional plain text nodes could break React if used with Google Translate. Wrap text into an element.',
      },
      // Ban text nodes before or after a condition `text {condition && <span/>} text`
      {
        selector:
          'JSXElement:has(JSXExpressionContainer.children > LogicalExpression[operator="&&"])' +
          ' > JSXText[value!=/^\\s+$/]',
        message:
          'Plain text nodes before or after a condition could break React if used with Google Translate. Wrap text into an element.',
      },
      // Ban variables before or after `{var} {condition && <span/>} {var}` (just in case they return a string)
      {
        selector:
          'JSXElement:has(JSXExpressionContainer.children > LogicalExpression[operator="&&"])' +
          ' > JSXExpressionContainer:matches([expression.type="Identifier"], [expression.type="CallExpression"])',
        message:
          'Plain text nodes before or after a condition could break React if used with Google Translate. Identifier could possibly return a string, so wrap it into an element.',
      },

      // Ban `condition ? text node : <span/>`
      {
        selector:
          'JSXElement > JSXExpressionContainer > ConditionalExpression' +
          ' > :matches(.consequent, .alternate):not(JSXElement, JSXFragment)',
        message:
          'Conditional plain text nodes could break React if used with Google Translate. Wrap text into an element.',
      },
      // Ban `condition ? <>text node</> : <span/>`
      {
        selector:
          'JSXElement > JSXExpressionContainer > ConditionalExpression' +
          ' > JSXFragment > .children:not(JSXElement, JSXText[value=/^\\s+$/])',
        message:
          'Conditional plain text nodes could break React if used with Google Translate. Wrap text into an element.',
      },
      // Ban text nodes before or after a condition `text {condition ? <span/> : <span/>} text`
      {
        selector:
          'JSXElement:has(JSXExpressionContainer.children > ConditionalExpression)' +
          ' > JSXText[value!=/^\\s+$/]',
        message:
          'Plain text nodes before or after a condition could break React if used with Google Translate. Wrap text into an element.',
      },
      // Ban variables before or after `{var} {condition ? <span/> : <span/>} {var}` (just in case they return a string)
      {
        selector:
          'JSXElement:has(JSXExpressionContainer.children > ConditionalExpression)' +
          ' > JSXExpressionContainer:matches([expression.type="Identifier"], [expression.type="CallExpression"])',
        message:
          'Plain text nodes before or after a condition could break React if used with Google Translate. Identifier could possibly return a string, so wrap it into an element.',
      },
    ],

    'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
    'react/react-in-jsx-scope': 'off', // Not needed after React v17
    'react/display-name': 'off', // TODO: Maybe enable

    '@typescript-eslint/no-empty-function': 'off', // Allow empty reducers for saga
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // TODO: Maybe enable
    '@typescript-eslint/no-empty-interface': 'off', // TODO: Enable. Empty interfaces aren't safe (equivalent to "any")
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': 'warn' },
    },
    {
      files: ['internals/**'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
    {
      files: ['**/*.js'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
}

module.exports = config
