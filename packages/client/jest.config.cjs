/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "\\.(scss|jpg|png)$": "<rootDir>/__mocks__/fileMock.js",
  },
};