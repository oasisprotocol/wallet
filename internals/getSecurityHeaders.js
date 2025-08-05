// @ts-check

// @TODO: Future improvements:
// - remove 'unsafe-inline' style by precomputing theme hash
// - add report-uri to gather errors if anything was missed

const dappFrameAncestors = `
  'self'
  https:
  http://localhost:*
  http://127.0.0.1:*
`
const localnet = `
  http://localhost:42280
  http://localhost:9001
`
const hmr = `
  http://localhost:2222
  ws://localhost:2222
`
const hmrScripts = `
  'unsafe-eval'
`

const warnImportMapViolation = async () => {
  const importMap = document.querySelector('script[type="importmap"]')
  if (!importMap) return
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(importMap.innerHTML))
  const cspHash = `sha256-${btoa(String.fromCharCode(...new Uint8Array(hash)))}`
  console.warn(
    `In dev mode parcel adds <script type="importmap">. CSP blocks executing this and shows it as violation '${cspHash}', but imports still work.`,
  )
}

/**
 * Keep this synced with deployment headers
 *
 * @param {{ isExtension: boolean, isDev: boolean }} param
 */
const getCsp = ({ isExtension, isDev }) =>
  `
    default-src 'none';
    script-src
      'self'
      ${!isExtension && isDev ? hmrScripts : '' /* Manifest v3 doesn't allow anything */}
      ${!isExtension ? 'report-sample' : ''}
      ;
    style-src
      'self'
      'unsafe-inline'
      'report-sample';
    font-src
      'self';
    connect-src
      'self'
      https://grpc.oasis.io
      https://testnet.grpc.oasis.io
      https://api.oasisscan.com
      https://nexus.oasis.io
      https://testnet.nexus.oasis.io
      ${isDev ? localnet : ''}
      ${isDev ? hmr : ''}
      ;
    frame-ancestors
      ${isExtension ? dappFrameAncestors : `'self'`};
    frame-src
      'self';
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

// Generated with https://www.permissionspolicy.com/
const getPermissionsPolicy = () =>
  `
    accelerometer=(),
    ambient-light-sensor=(),
    autoplay=(),
    bluetooth=(self),
    camera=(),
    cross-origin-isolated=(),
    display-capture=(),
    document-domain=(self),
    encrypted-media=(),
    execution-while-not-rendered=(),
    execution-while-out-of-viewport=(),
    fullscreen=(self),
    geolocation=(),
    gyroscope=(),
    keyboard-map=(),
    magnetometer=(),
    microphone=(),
    midi=(),
    navigation-override=(),
    payment=(),
    picture-in-picture=(),
    publickey-credentials-get=(),
    screen-wake-lock=(),
    sync-xhr=(),
    usb=(self),
    web-share=(),
    xr-spatial-tracking=()
  `
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)
    .join(' ')
    .replace(/ ,/g, ',')

module.exports = { getCsp, getPermissionsPolicy, warnImportMapViolation }
