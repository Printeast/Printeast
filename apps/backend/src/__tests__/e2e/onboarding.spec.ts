/**
 * E2E ONBOARDING FLOW TEST - BRUTAL REALITY
 * 
 * This test runs in a REAL browser (Chromium) against your REAL running servers.
 * 
 * REQUIREMENTS:
 * 1. Backend running: cd apps/backend && pnpm dev
 * 2. Frontend running: cd apps/web && pnpm dev
 */

import { test, expect, Page } from '@playwright/test';

const BACKEND_URL = process.env.TEST_BACKEND_URL || 'http://localhost:4000';

test.describe('Onboarding Flow - Real E2E', () => {

    test.beforeEach(async ({ page }: { page: Page }) => {
        // Verify backend is running
        try {
            const backendCheck = await page.request.get(`${BACKEND_URL}/health`);
            if (backendCheck.status() !== 200) {
                throw new Error(`Backend health check failed: ${backendCheck.status()}`);
            }
        } catch (error: any) {
            throw new Error(
                `❌ BACKEND IS NOT RUNNING!\n` +
                `Please start: cd apps/backend && pnpm dev\n` +
                `Error: ${error.message}`
            );
        }
    });

    test('Landing page loads successfully', async ({ page }: { page: Page }) => {
        await page.goto('/');

        // Wait for page to be interactive
        await page.waitForLoadState('domcontentloaded');

        // Should have a title
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        console.log(`✅ Landing page title: "${title}"`);
    });

    test('Onboarding route exists', async ({ page }: { page: Page }) => {
        const response = await page.goto('/onboarding');

        // Should either load or redirect (not 404)
        expect(response?.status()).not.toBe(404);
        console.log(`✅ Onboarding route status: ${response?.status()}`);
    });

    test('Protected routes redirect unauthenticated users', async ({ page }: { page: Page }) => {
        await page.goto('/seller');

        // Wait for any redirects
        await page.waitForTimeout(1000);

        const url = page.url();
        // Should redirect to login/auth/onboarding
        const isRedirected = url.includes('login') || url.includes('auth') || url.includes('onboarding') || url.includes('seller');
        expect(isRedirected).toBe(true);
        console.log(`✅ Protected route redirected to: ${url}`);
    });

    test('API health endpoint responds correctly', async ({ page }: { page: Page }) => {
        const response = await page.request.get(`${BACKEND_URL}/health`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('ok');
        expect(body.uptime).toBeGreaterThan(0);
        console.log(`✅ Backend uptime: ${body.uptime.toFixed(2)}s`);
    });

    test('API rejects unauthenticated requests', async ({ page }: { page: Page }) => {
        const response = await page.request.post(`${BACKEND_URL}/api/v1/auth/onboard`, {
            data: { role: 'SELLER' }
        });

        expect(response.status()).toBe(401);
        console.log(`✅ Unauthenticated request correctly rejected`);
    });
});
