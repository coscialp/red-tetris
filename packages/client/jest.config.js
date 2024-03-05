/** @type {import("jest").Config} */
export default {
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx",
  ],
  "rootDir": "src",
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    html: '<html lang="zh-cmn-Hant"></html>',
    url: 'https://jestjs.io/',
    userAgent: 'Agent/007',
  },
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/dist/",
  ],
  "testRegex": ".*\\.spec\\.tsx$",
  "transform": {
    "^.+\\.(t|j)s(x|)$": "ts-jest",
    "^.+\\.scss$": "jest-scss-transform",
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s(x|)",
  ],
  "coverageDirectory": "../coverage",
};
