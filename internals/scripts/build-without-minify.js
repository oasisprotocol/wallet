// @ts-check
/**
 * A workaround to disable minification in `react-scripts build` to improve
 * error stack traces reported by users. But it also increases gzipped bundle
 * size from ~600KB to ~900KB (raw 3MB to 6MB).
 *
 * `react-scripts build` doesn't have a way to disable minification
 * (https://create-react-app.dev/docs/advanced-configuration/), but they
 * recommend forking react-scripts or ejecting. That seems too much to maintain.
 * And "alternatives to ejecting" seem very heavy or outdated.
 *
 * If this ever starts breaking: just switch back to `react-scripts build`
 * without preloading this.
 */

// 'react-scripts/scripts/build.js' imports '../config/webpack.config'
// @ts-ignore
require.cache[require.resolve('react-scripts/config/webpack.config')] = {
  exports: webpackEnv => {
    const configFactory = requireIgnoringCache('react-scripts/config/webpack.config')
    const webpackConfig = configFactory(webpackEnv)
    webpackConfig.optimization.minimize = false
    return webpackConfig
  }
}

function requireIgnoringCache (moduleName) {
  const fullPath = require.resolve(moduleName)
  const overridenModule = require.cache[fullPath]
  delete require.cache[fullPath]
  const importedModule = require(fullPath)
  require.cache[fullPath] = overridenModule
  return importedModule
}
