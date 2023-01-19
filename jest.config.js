// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/vendors/**/*',
    '!src/**/*/*.d.ts',
    '!src/**/*/Loadable.{js,jsx,ts,tsx}',
    '!src/**/*/messages.ts',
    '!src/**/*/types.ts',
    '!src/index.tsx',
  ],
  projects: ['<rootDir>/internals/jest/jest.web-config.js', '<rootDir>/internals/jest/jest.ext-config.js'],
}

module.exports = config
