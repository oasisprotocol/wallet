// @ts-check

/**
 * Add security headers to dev server
 * @param {import('connect').Server} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    // Re-generate headers on every request so editing the file is reflected on reload.
    delete require.cache[require.resolve('./internals/getSecurityHeaders.js')];
    const { getCsp, getPermissionsPolicy } = require('./internals/getSecurityHeaders.js')

    res.setHeader('Content-Security-Policy', getCsp({ isDev: true, isExtension: false }))
    res.setHeader('Permissions-Policy', getPermissionsPolicy())
    next()
  })
}
