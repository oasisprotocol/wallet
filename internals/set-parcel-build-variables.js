const buildEnv = Object.create(process.env)

const { buildDatetime, sha } = require('./getBuildData.js')
const { csp } = require('./getCsp.js')

buildEnv.REACT_APP_BUILD_DATETIME = buildDatetime
buildEnv.REACT_APP_BUILD_VERSION = sha
buildEnv.REACT_APP_META_CSP = csp

module.exports = { buildEnv }
