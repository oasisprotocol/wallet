// @ts-check
const { getCsp } = require('../getPermissionHeaders.js')
console.log(getCsp({ isExtension: true }))
