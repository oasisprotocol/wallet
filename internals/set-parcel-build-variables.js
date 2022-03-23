const { buildDatetime, sha } = require('./getBuildData.js')
const { csp } = require('./getCsp.js')

module.exports = ({ withCSP }) => {
  const buildEnv = Object.create(process.env)
  buildEnv.REACT_APP_BUILD_DATETIME = buildDatetime
  buildEnv.REACT_APP_BUILD_VERSION = sha
  buildEnv.REACT_APP_META_CSP = withCSP ? csp : ''

  return buildEnv
}
