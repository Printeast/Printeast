/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest', {
            jsc: {
                parser: {
                    syntax: 'typescript',
                    tsx: true,
                },
                transform: {
                    react: {
                        runtime: 'automatic',
                    },
                },
            },
        }],
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.tsx'],
    testTimeout: 15000,
    verbose: true,
    collectCoverageFrom: [
        'src/components/**/*.tsx',
        '!src/components/**/*.stories.tsx',
    ],
};
