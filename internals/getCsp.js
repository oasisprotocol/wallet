// @TODO: Future improvements:
// - remove google exceptions by downloading fonts
// - remove 'unsafe-inline' style by precomputing theme hash
// - add report-uri to gather errors if anything was missed

const cspEnhancement = `
  frame-ancestors 
    'self' 
    https: http://localhost:* http://127.0.0.1:*;
  `

// Keep synced with deployment
const csp = ({ extension } = {}) =>
  `
    default-src 'none';
    script-src
      'self'
      'report-sample';
    style-src
      'self'
      fonts.googleapis.com
      'unsafe-inline'
      'report-sample';
    font-src
      'self'
      fonts.gstatic.com;
    connect-src
      'self'
      grpc.oasis.dev
      testnet.grpc.oasis.dev
      api.oasisscan.com
      monitor.oasis.dev;
    img-src 'self' data: https:;
    prefetch-src 'self';
    base-uri 'self';
    manifest-src 'self';
    ${extension ? cspEnhancement : ''}
  `
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join(' ')

module.exports = { csp }
