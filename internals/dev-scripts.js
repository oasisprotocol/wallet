const execSync = require('child_process').execSync
const buildEnv = require('./set-parcel-build-variables.js')

execSync('yarn parcel:dev', { env: buildEnv({ withCSP: false }), stdio: 'inherit' })
