const fs = require('fs')
const path = require('path')

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'))

module.exports = {
  extends: ['react-app', 'prettier'],
  plugins: ['prettier'],
  settings: {
    // Warn about <a target="_blank" rel="noopener"> in components other than "a"
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md#custom-link-components
    linkComponents: ['Button', 'MediaButton', 'SidebarButton', 'Anchor']
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'react/jsx-no-target-blank': ['error', { allowReferrer: true }]
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] }
    }
  ]
}
