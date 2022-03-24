module.exports = {
  ...require('./jest.base-config'),
  name: 'web',
  displayName: 'Web Wallet',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
}
