// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  ...require('./jest.base-config'),
  displayName: 'Web Wallet',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
}

module.exports = config
