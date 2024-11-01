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
// If this changes csp-react-error-overlay.spec.ts will print a new sha in an error in csp-react-error-overlay.spec.ts.
const reactErrorOverlay = `'sha256-yt+SNVxRkIi6H6yb7ndFuZM1esMX9esg3UpRHaTsyVk='`
const hmrScripts = `
  'unsafe-eval'
`

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
      ${!isExtension && isDev ? reactErrorOverlay : '' /* Manifest v3 doesn't allow anything */}
      ${!isExtension && isDev ? hmrScripts : ''}
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
      'self'
      https://global.transak.com
      https://global-stg.transak.com;
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
    accelerometer=*,
    ambient-light-sensor=*,
    autoplay=(),
    bluetooth=(self),
    camera=*,
    cross-origin-isolated=(),
    display-capture=(),
    document-domain=(self),
    encrypted-media=*,
    execution-while-not-rendered=(),
    execution-while-out-of-viewport=(),
    fullscreen=(self "https://global.transak.com" "https://global-stg.transak.com"),
    geolocation=(),
    gyroscope=*,
    keyboard-map=(),
    magnetometer=*,
    microphone=*,
    midi=(),
    navigation-override=(),
    payment=("https://global.transak.com" "https://global-stg.transak.com"),
    picture-in-picture=(),
    publickey-credentials-get=*,
    screen-wake-lock=(),
    sync-xhr=(),
    usb=(self),
    web-share=*,
    xr-spatial-tracking=()
  `
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)
    .join(' ')
    .replace(/ ,/g, ',')

module.exports = { getCsp, getPermissionsPolicy, reactErrorOverlay }
