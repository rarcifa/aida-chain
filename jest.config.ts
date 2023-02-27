module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@blockchain/(.*)$': '<rootDir>/src/blockchain/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@handlers/(.*)$': '<rootDir>/src/handlers/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'interfaces',
    'jestGlobalMocks.ts',
    '<rootDir>/src/config/logger.ts',
    '.module.ts',
    '<rootDir>/src/app.ts',
    '.mock.ts',
  ],
  modulePathIgnorePatterns: ['<rootDir>/src/config/'],
};
