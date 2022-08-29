// @ts-check
const buildSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()
const buildDatetime = Math.floor(Date.now() / 1000).toString()

module.exports = { buildDatetime, buildSha }
