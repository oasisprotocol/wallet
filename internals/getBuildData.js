const sha = require('child_process').execSync('git rev-parse HEAD').toString().trim()
const buildDatetime = Date.now()

module.exports = { buildDatetime, sha }
