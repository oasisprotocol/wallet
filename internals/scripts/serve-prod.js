// @ts-check
const path = require('path')
const http = require('http')
const fs = require('fs')
const { getCsp, getPermissionsPolicy } = require('../getSecurityHeaders.js')
const csp = getCsp({ isDev: false, isExtension: false })
const permissionsPolicy = getPermissionsPolicy()
console.log(`Content-Security-Policy: ${csp}\n`)
console.log(`Permissions-Policy: ${permissionsPolicy}\n`)

const root = path.resolve(__dirname, '../..')
const buildDir = path.join(root, 'build')

const contentTypeMap = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
}

const server = http.createServer((request, response) => {
  let url = request.url || '/'
  let decodedUrl = decodeURIComponent(url)
  let relativePath = decodedUrl === '/' ? 'index.html' : decodedUrl.replace(/^\/+/, '')
  relativePath = relativePath.split('?')[0]
  let filePath = path.normalize(path.join(buildDir, relativePath))

  if (!filePath.startsWith(buildDir)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(buildDir, 'index.html')
    }

    const ext = path.extname(filePath)
    const contentType = contentTypeMap[ext] || 'text/plain'

    fs.readFile(filePath, (err, data) => {
      if (err) {
        response.writeHead(500)
        response.end('Error loading file')
        return
      }

      response.setHeader('Content-Type', contentType)
      response.setHeader('Content-Security-Policy', csp)
      response.setHeader('Permissions-Policy', permissionsPolicy)
      response.setHeader('Cache-Control', 'no-store, no-cache')

      response.writeHead(200)
      response.end(data)
    })
  })
})

server.listen(5000, () => {
  console.log('Running at http://localhost:5000')
})
