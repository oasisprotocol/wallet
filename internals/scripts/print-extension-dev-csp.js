// @ts-check
const { getCsp } = require('../getSecurityHeaders.js')
console.log(getCsp({ isDev: true, isExtension: true }))
