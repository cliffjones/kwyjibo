module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.tsx', '!src/**/*.test.tsx', '!src/main.tsx'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '\\.scss$': '<rootDir>/test/styleMock.cjs'
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};
