const { buildTime, sha } = require('../getBuildData.js')
process.env.REACT_APP_BUILD_TIME = buildTime
process.env.REACT_APP_BUILD_VERSION = sha
