// @ts-check
const path = require('path')
const http = require('http')
const serveHandler = require('serve-handler')

const root = path.resolve(__dirname, '../..')

const server = http.createServer((request, response) => {
  return serveHandler(request, response, {
    public: path.join(root, 'build'),
    rewrites: [
      {
        source: '**',
        destination: '/index.html',
      },
    ],
    // Disable etag so we don't need to clear cache if we only change CSP.
    etag: false,
    headers: [
      {
        source: '**',
        headers: [
          {
            // Keep synced with deployment
            key: 'Content-Security-Policy',
            value: `default-src 'none'; script-src 'report-sample' 'self'; style-src 'report-sample' 'self' fonts.googleapis.com 'unsafe-inline'; font-src 'self' fonts.gstatic.com; connect-src 'self' grpc.oasis.dev testnet.grpc.oasis.dev monitor.oasis.dev; img-src 'self' data: https:; prefetch-src 'self'; base-uri 'self'; manifest-src 'self';`,
          },
        ],
      },
    ],
  })
})

server.listen(5000, () => {
  console.log('Running at http://localhost:5000')
})
