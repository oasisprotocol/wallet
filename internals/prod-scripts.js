const execSync = require('child_process').execSync
const { buildEnv } = require('./set-parcel-build-variables.js')

execSync('yarn parcel:build', { env: buildEnv, stdio: 'inherit' })
execSync('cp src/robots.txt build/robots.txt', { encoding: 'utf8' })
