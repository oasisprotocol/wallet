module.exports = {
  rootDir: './../../',
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/vendors/**/*',
    '!src/**/*/*.d.ts',
    '!src/**/*/Loadable.{js,jsx,ts,tsx}',
    '!src/**/*/messages.ts',
    '!src/**/*/types.ts',
    '!src/index.tsx',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>internals/mocks/cssModule.js',
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
