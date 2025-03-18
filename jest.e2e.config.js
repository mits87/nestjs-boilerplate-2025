const config = require('./jest.config.js');

module.exports = {
  ...config,
  detectOpenHandles: false,
  collectCoverage: false,
  roots: ['<rootDir>/test/e2e'],
  testMatch: ['<rootDir>/**/*.e2e-spec.ts'],
  testTimeout: 60000,
};
