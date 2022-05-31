// @ts-check
const execSync = require('child_process').execSync
const { getCsp } = require('./getCsp.js')

process.env.REACT_APP_BUILD_DATETIME = Date.now().toString()
process.env.REACT_APP_BUILD_SHA = execSync('git rev-parse HEAD').toString().trim()
process.env.REACT_APP_META_CSP = getCsp()

execSync('yarn parcel:prod', { stdio: 'inherit' })
execSync('cp src/robots.txt build/robots.txt', { encoding: 'utf8' })
