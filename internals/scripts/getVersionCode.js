const execSync = require('child_process').execSync
const packageJson = require('../../package.json')

// The greatest value Google Play allows for versionCode is 2100000000
// https://developer.android.com/studio/publish/versioning
function getVersionCode() {
  const version = packageJson.version
  const gitCommitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim()
  const versionPrefix = version
    .split('.')
    .map((n, i) => (i > 0 ? n.padStart(2, '0') : n))
    .join('')

  return `${versionPrefix}${gitCommitCount.padStart(4, '0')}`
}

module.exports = { getVersionCode }

// When run directly in Node output the version code. Used in CI/CD scripts.
if (require.main === module) {
  console.log(getVersionCode())
}
