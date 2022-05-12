// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  ...require('./jest.base-config'),
  name: 'web',
  displayName: 'Web Wallet',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ]
}

module.exports = config
