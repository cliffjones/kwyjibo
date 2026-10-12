module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.tsx', '!src/main.tsx'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '\\.scss$': '<rootDir>/test/styleMock.cjs'
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};
