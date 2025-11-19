module.exports = {
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: ['calculator.js'],
  testMatch: ['**/*.test.js'],
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'json'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};