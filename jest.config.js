const path = require('path');

module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__tests__/**/*.test.js'],
    cacheDirectory: path.join(__dirname, '.jest-cache'),
};
