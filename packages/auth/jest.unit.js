module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.unit.json',
    },
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/test/unit/**/*.ts'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/.git/',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
