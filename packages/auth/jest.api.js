module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.api.json',
    },
  },
  setupFiles: ['<rootDir>/jest.setup.api.ts'],
  testMatch: ['<rootDir>/src/test/api/**/*.ts'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/.git/',
  ],
  coverageDirectory: '<rootDir>/coverage/api',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/domain/entity',
    '<rootDir>/src/infra/http',
    '<rootDir>/src/infra/repository',
    '<rootDir>/src/presentation/presenter/express',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
