const manifest = require('../../build-ext/manifest.json')

if (manifest.content_security_policy.includes('EXTENSION_CSP')) {
  console.log('CSP rules not generated!')
  process.exit(1)
} else {
  process.exit(0)
}
