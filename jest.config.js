module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/vendors/**/*',
    '!src/**/*/*.d.ts',
    '!src/**/*/Loadable.{js,jsx,ts,tsx}',
    '!src/**/*/messages.ts',
    '!src/**/*/types.ts',
    '!src/index.tsx'
  ],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/internals/jest/babelTransform.js'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '.*\\.(css|scss|sass)$': '<rootDir>internals/mocks/cssModule.js'
  },
  moduleFileExtensions: ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  resetMocks: true
}
