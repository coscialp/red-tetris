import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  maxWorkers: '50%',
  rootDir: './src',
  moduleNameMapper: {
    "\\.(scss|sass|css)$": "./Input"
  },
};

export default config;
