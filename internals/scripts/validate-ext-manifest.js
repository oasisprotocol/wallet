const manifest = require('../../build-ext/manifest.json')

if (manifest.content_security_policy.includes('EXTENSION_CSP')) {
  console.error('CSP rules were not injected by parcel-transformer-env-variables-injection!')
  process.exit(1)
}
