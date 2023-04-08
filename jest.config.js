module.exports = {
  globalSetup: './global-setup.js',
  transformIgnorePatterns: ['node_modules/?!(lit-html)'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coveragePathIgnorePatterns: [
    'src/types/',
    'index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50
    }
  },
  setupFiles: [
    './tests/helpers/TestHelpers.ts'
  ],
  snapshotSerializers: ["jest-serializer-html"]
}
