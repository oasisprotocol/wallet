// @TODO: Future improvements:
// - remove 'unsafe-inline' style by precomputing theme hash
// - add report-uri to gather errors if anything was missed

// Keep synced with deployment
const csp = `
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
      grpc.oasis.dev
      testnet.grpc.oasis.dev
      api.oasisscan.com
      monitor.oasis.dev;
    img-src 'self' data: https:;
    prefetch-src 'self';
    base-uri 'self';
    manifest-src 'self';
  `
  .trim()
  .split('\n')
  .map(line => line.trim())
  .join(' ')

module.exports = { csp }
