// @ts-check
const execSync = require('child_process').execSync
const { getCsp } = require('../getCsp.js')
const { buildDatetime, buildSha, buildVersion } = require('../getBuildData')

process.env.REACT_APP_BUILD_DATETIME = buildDatetime
process.env.REACT_APP_BUILD_SHA = buildSha
process.env.REACT_APP_BUILD_VERSION = buildVersion
process.env.REACT_APP_META_CSP = getCsp().replace(/frame-ancestors .*?;/, '')

console.log(`Content-Security-Policy: ${process.env.REACT_APP_META_CSP}\n`)

execSync('yarn clean && parcel build --target web --dist-dir build', { stdio: 'inherit' })
execSync('cp public/robots.txt build/robots.txt', { encoding: 'utf8' })
