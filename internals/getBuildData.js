// @ts-check
const buildSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()
const buildVersion = require('child_process').execSync('git describe --tags --abbrev=0').toString().trim()
const buildDatetime = Date.now().toString()

module.exports = { buildSha, buildVersion, buildDatetime }
