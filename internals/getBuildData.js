const sha = require('child_process').execSync('git rev-parse HEAD').toString().trim()
const buildTime = Date.now()

module.exports = { buildTime, sha }
