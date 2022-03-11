const execSync = require('child_process').execSync
const { buildEnv } = require('./set-parcel-build-variables.js')

execSync('yarn parcel', { env: buildEnv, stdio: 'inherit' })
