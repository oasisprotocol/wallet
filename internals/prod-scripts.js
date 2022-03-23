const execSync = require('child_process').execSync
const buildEnv = require('./set-parcel-build-variables.js')

execSync('yarn parcel:prod', { env: buildEnv({ withCSP: true }), stdio: 'inherit' })
execSync('cp src/robots.txt build/robots.txt', { encoding: 'utf8' })
