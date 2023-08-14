// @ts-check
const execSync = require('child_process').execSync
const { getCsp } = require('../getSecurityHeaders.js')
const { buildDatetime, buildSha, buildVersion } = require('../getBuildData')

process.env.REACT_APP_BUILD_DATETIME = buildDatetime
process.env.REACT_APP_BUILD_SHA = buildSha
process.env.REACT_APP_BUILD_VERSION = buildVersion
process.env.EXTENSION_CSP = getCsp({ isExtension: true })

console.log(`Content-Security-Policy: ${process.env.EXTENSION_CSP}\n`)

execSync('yarn clean:ext', { stdio: 'inherit' })
execSync('parcel build --target ext --dist-dir build-ext', { stdio: 'inherit' })
execSync('node ./internals/scripts/validate-ext-manifest.js', { stdio: 'inherit' })
