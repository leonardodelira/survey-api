module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*protocols.ts',
    '!<rootDir>/src/**/protocols/**',
    '!<rootDir>/src/main/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: [
    './setup-jest.ts'
  ],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
