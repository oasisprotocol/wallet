module.exports = {
  ...require('./jest.base-config'),
  name: 'ext',
  displayName: 'Extension Wallet',
  testMatch: [
    '<rootDir>/extension/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/extension/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
}
