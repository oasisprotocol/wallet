const typescriptTransform = require('i18next-scanner-typescript')

module.exports = {
  input: ['src/app/**/**.{js,jsx,ts,tsx}', '!**/node_modules/**', '!src/app/**/*.test.{ts,tsx}'],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t'],
      extensions: ['js', 'jsx'], // We dont want this extension because we manually check on transform function below
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      fallbackKey: (ns, value) => {
        return value
      },
      extensions: ['js', 'jsx'],
    },
    lngs: ['en'],
    defaultLng: 'en',
    defaultNs: 'translation',
    resource: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
      savePath: 'src/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    keySeparator: '.', // char to separate keys
    nsSeparator: ':', // char to split namespace from key
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  transform: typescriptTransform({
    extensions: ['.ts', '.tsx'],
    tsOptions: { jsx: 'preserve', target: 'es2018' },
  }),
}
