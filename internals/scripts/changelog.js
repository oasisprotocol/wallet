const execSync = require('child_process').execSync
const semver = require('semver')
const glob = require('glob')
const fs = require('fs')
const prettier = require('prettier')
const packageJson = require('../../package.json')
const extensionManifest = require('../../public/manifest.json')

const folderPath = '.changelog/'
const majorPattern = `${folderPath}*breaking*.md`
const minorPattern = `${folderPath}*feature*.md`
const patchPattern = `${folderPath}*{process,cfg,bugfix,doc,internal,trivial}*.md`

console.log('Assembling Change Log and updating package version')

let version = packageJson.version
if (glob.sync(majorPattern).length > 0) {
  console.log('\x1b[31m%s\x1b[0m', 'Warning: This release contains breaking changes.')
  version = semver.inc(version, 'major')
} else if (glob.sync(minorPattern).length > 0) {
  version = semver.inc(version, 'minor')
} else if (glob.sync(patchPattern).length > 0) {
  version = semver.inc(version, 'patch')
} else {
  console.log('No Change Log fragments found. Aborting release...')
  process.exit(1)
}

if (!semver.valid(version)) {
  console.log(`Invalid version: ${version}`)
  process.exit(1)
}

if (semver.lte(version, packageJson.version)) {
  console.log(`Version ${version} is not greater than ${packageJson.version}`)
  process.exit(1)
}

execSync(`yarn version --no-git-tag-version --new-version ${version}`, { stdio: 'inherit' })

// Extension needs to bump version in manifest file too
extensionManifest.version = version
prettier
  .format(JSON.stringify(extensionManifest), {
    parser: 'json',
  })
  .then(formattedManifestJsonString => {
    fs.writeFileSync('./public/manifest.json', formattedManifestJsonString)
  })
  .catch(error => {
    console.error('Error formatting manifest:', error)
  })

execSync(`towncrier build --version ${version}`, { stdio: 'inherit' })

// Mobile build version used internally in stores
const gitCommitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim()
const versionPrefix = version
  .split('.')
  .map((n, i) => (i > 0 ? n.padStart(2, '0') : n))
  .join('')

// The greatest value Google Play allows for versionCode is 2100000000
// https://developer.android.com/studio/publish/versioning
const newVersionCode = `${versionPrefix}${gitCommitCount.padStart(4, '0')}`

// Android app needs to bump versionName in build.gradle
const gradleFilePath = './android/app/build.gradle'
const gradleContent = fs.readFileSync(gradleFilePath, 'utf8')
let updatedGradleContent = gradleContent.replace(/versionName\s+"[\d.]+"/, `versionName "${version}"`)
updatedGradleContent = updatedGradleContent.replace(
  /(def versionCodeOverride = project\.hasProperty\('versionCodeOverride'\) \? project\.property\('versionCodeOverride'\)\.toInteger\(\) : )\d+/,
  `$1${newVersionCode}`,
)
fs.writeFileSync(gradleFilePath, updatedGradleContent, 'utf8')

// iOS app needs to bump MARKETING_VERSION in project.pbxproj
const pbxprojFilePath = './ios/App/App.xcodeproj/project.pbxproj'
const pbxprojContent = fs.readFileSync(pbxprojFilePath, 'utf8')
let updatedPbxprojContent = pbxprojContent.replace(
  /MARKETING_VERSION = [\d.]+;/g,
  `MARKETING_VERSION = ${version};`,
)
updatedPbxprojContent = updatedPbxprojContent.replace(
  /CURRENT_PROJECT_VERSION = \d+;/g,
  `CURRENT_PROJECT_VERSION = ${newVersionCode};`,
)
fs.writeFileSync(pbxprojFilePath, updatedPbxprojContent, 'utf8')
