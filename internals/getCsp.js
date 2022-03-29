// @TODO: Future improvements:
// - remove 'unsafe-inline' style by precomputing theme hash
// - add report-uri to gather errors if anything was missed

const extensionFrame = `
  frame-ancestors 
    'self' 
    https: http://localhost:* http://127.0.0.1:*;
  `
const extensionWebsocket = `
  ws://localhost:2222
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
      'unsafe-inline'
      'report-sample';
    font-src
      'self';
    connect-src
      'self'
      https://grpc.oasis.dev
      https://testnet.grpc.oasis.dev
      https://api.oasisscan.com
      https://monitor.oasis.dev
      ${extension ? extensionWebsocket : ''}
      ;
    img-src 'self' data: https:;
    prefetch-src 'self';
    base-uri 'self';
    manifest-src 'self';
    ${extension ? extensionFrame : ''}
  `
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join(' ')

module.exports = { csp }
