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
 * If this ever starts breaking: just switch back to `build:minified`.
 */

function overrideWebpackConfigModule (originalModule) {
  /** @type {import('react-scripts/config/webpack.config')} */
  const configFactory = originalModule
  return function (webpackEnv) {
    const webpackConfig = configFactory(webpackEnv)
    webpackConfig.optimization.minimize = false
    return webpackConfig
  }
}

// Override global `require` (could use `proxyquire` or `rewire`)
const Module = require('module')
const originalGlobalRequire = Module.prototype.require
// @ts-ignore
Module.prototype.require = function (filename) {
  const importedModule = originalGlobalRequire.call(this, filename)
  if (filename === '../config/webpack.config') return overrideWebpackConfigModule(importedModule)
  return importedModule
}

require('react-scripts/scripts/build.js')
