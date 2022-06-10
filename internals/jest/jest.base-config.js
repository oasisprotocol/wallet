// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  rootDir: './../../',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>internals/jest/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>internals/jest/mocks/image.js',
  },
  modulePaths: ['<rootDir>/src'],
  resetMocks: true,
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/internals/jest/babelTransform.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}

module.exports = config
