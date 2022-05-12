// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  ...require('./jest.base-config'),
  name: 'ext',
  displayName: 'Extension Wallet',
  testMatch: [
    '<rootDir>/extension/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/extension/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ]
}

module.exports = config
