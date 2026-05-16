/** @type {import('jest').Config} */
const config = {
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  verbose: true,
  testResultsProcessor: 'jest-sonar-reporter',
};

export default config;
