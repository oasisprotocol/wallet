// @ts-check
const execSync = require('child_process').execSync
const { getCsp, getPermissionsPolicy } = require('../getSecurityHeaders.js')
const { buildDatetime, buildSha, buildVersion } = require('../getBuildData')

const csp = getCsp({ isDev: false, isExtension: false })
const permissionsPolicy = getPermissionsPolicy()
console.log(`Content-Security-Policy: ${csp}\n`)
console.log(`Permissions-Policy: ${permissionsPolicy}\n`)

process.env.REACT_APP_BUILD_DATETIME = buildDatetime
process.env.REACT_APP_BUILD_SHA = buildSha
process.env.REACT_APP_BUILD_VERSION = buildVersion
// Fix warning "'frame-ancestors' is ignored when delivered via <meta>"
process.env.REACT_APP_META_CSP = csp.replace(/frame-ancestors .*?;/, '')

execSync('yarn clean && parcel build --target web --dist-dir build', { stdio: 'inherit' })
execSync('cp public/robots.txt build/robots.txt', { encoding: 'utf8' })
