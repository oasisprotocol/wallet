// @ts-check
// https://github.com/oasisprotocol/oasis-core/blob/50d972df71fed2bcaa88e6ce5430d919ec08087d/common.mk#L171-L180
const execSync = require('child_process').execSync

const GIT_ORIGIN_REMOTE = 'origin'
const RELEASE_BRANCH = 'master'
const BRANCH = `${GIT_ORIGIN_REMOTE}/${RELEASE_BRANCH}`
const COMMIT_SHA = require('child_process').execSync(`git rev-parse ${BRANCH}`).toString().trim()

console.log(`*** Running gitlint for commits from ${BRANCH} (${COMMIT_SHA})`)

try {
  execSync(`gitlint --commits ${BRANCH}..HEAD`, { stdio: 'inherit' })
} catch (error) {
  process.exit(1)
}
