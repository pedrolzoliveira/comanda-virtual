/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1'
  },
  globalSetup: '<rootDir>/config/jest/setup.js'
}
