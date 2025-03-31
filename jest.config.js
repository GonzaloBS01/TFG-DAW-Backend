/** @type {import('jest').Config} */
const config = {
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  verbose: true,
};

export default config;