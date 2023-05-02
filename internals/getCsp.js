// @ts-check

// @TODO: Future improvements:
// - remove 'unsafe-inline' style by precomputing theme hash
// - add report-uri to gather errors if anything was missed

const extensionCsp = {
  dappFrameAncestors: `
    frame-ancestors
      'self'
      https:
      http://localhost:*
      http://127.0.0.1:*;
  `,
  hmrWebsocket: `
    ws://localhost:2222
  `,
}

// Keep synced with deployment
const getCsp = ({ isExtension } = { isExtension: false }) =>
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
      ${isExtension ? extensionCsp.hmrWebsocket : ''}
      ;
    ${isExtension ? extensionCsp.dappFrameAncestors : ''}
    img-src 'self' data: https:;
    base-uri 'self';
    manifest-src 'self';
  `
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)
    .join(' ')
    .replace(/ ;/g, ';')

module.exports = { getCsp }
