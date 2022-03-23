module.exports = require('babel-jest').default.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'automatic',
      },
    ],
  ],
  babelrc: false,
  configFile: false,
})
