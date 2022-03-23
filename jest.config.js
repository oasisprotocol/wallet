// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  projects: ['<rootDir>/internals/jest/jest.web-config.js', '<rootDir>/internals/jest/jest.ext-config.js'],
}

module.exports = config
