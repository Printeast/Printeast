import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src/__tests__/e2e',
    testMatch: '**/*.spec.ts',
    testIgnore: ['**/apps/**', '**/packages/**'], // STRICT: Ignore source code tests
    fullyParallel: false, // Run tests sequentially for database consistency
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Single worker to avoid DB conflicts
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
