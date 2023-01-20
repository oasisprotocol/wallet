// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  rootDir: './',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>internals/jest/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>internals/jest/mocks/image.js',
  },
  modulePaths: ['<rootDir>/src'],
  resetMocks: true,
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/internals/jest/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': [
      'ts-jest',
      {
        // Disable typechecking to speedup tests. We have `yarn checkTs`.
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@ledgerhq/hw-transport-webusb|cborg|grommet/es6|grommet-icons/es6)/)',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/extension/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/extension/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/vendors/**/*',
    '!src/**/*/*.d.ts',
    '!src/**/*/Loadable.{js,jsx,ts,tsx}',
    '!src/**/*/messages.ts',
    '!src/**/*/types.ts',
    '!src/index.tsx',
  ],
}

module.exports = config
