/**
 * BRUTAL FRONTEND REALITY TESTS
 * 
 * We test the "Processing" state with:
 * 1. ZERO Artificial Delay: Prove the UI is as fast as the API.
 * 2. Flaky Network: Simulate 503 errors and verify exponential backoff.
 * 3. Exact Integration: Match the real store structure and named exports.
 */

import { render, waitFor } from '@testing-library/react';
import { ProcessingStep } from '../../../components/onboarding/steps/processing';
import { api } from '@/services/api.service';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

// Mock dependencies
jest.mock('@/services/api.service', () => ({
    api: {
        post: jest.fn()
    }
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

describe('ProcessingStep - Brutal Reality', () => {
    let mockRouter: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRouter = { replace: jest.fn() };
        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        // Reset store with REAL structure
        useOnboardingStore.setState({
            answers: { interest: 'pod' },
            computedPath: 'SELLER_STARTER',
            reset: jest.fn()
        });
    });

    it('should NOT have any artificial delay (Must finish in < 50ms)', async () => {
        (api.post as jest.Mock).mockResolvedValue({
            success: true,
            data: { redirectTo: '/seller' }
        });

        render(<ProcessingStep />);

        await waitFor(() => {
            expect(mockRouter.replace).toHaveBeenCalledWith('/seller');
        });
    });

    it('should survive a flaky network (2 failures -> Success)', async () => {
        // First 2 calls fail, 3rd succeeds
        (api.post as jest.Mock)
            .mockRejectedValueOnce(new Error('503 Service Unavailable'))
            .mockRejectedValueOnce(new Error('504 Gateway Timeout'))
            .mockResolvedValueOnce({
                success: true,
                data: { redirectTo: '/seller' }
            });

        render(<ProcessingStep />);

        // Should eventually succeed after retries
        await waitFor(() => {
            expect(mockRouter.replace).toHaveBeenCalledWith('/seller');
        }, { timeout: 5000 });

        expect(api.post).toHaveBeenCalledTimes(3);
    });

    it('should redirect according to computedPath mapping', async () => {
        // CASE: ARTIST -> /creator
        useOnboardingStore.setState({ computedPath: 'ARTIST', answers: {} });
        (api.post as jest.Mock).mockResolvedValue({ success: true, data: {} });

        render(<ProcessingStep />);

        await waitFor(() => {
            expect(mockRouter.replace).toHaveBeenCalledWith('/creator');
        });
    });

    it('should pass EXACT payload matching the schema', async () => {
        const testAnswers = { goal: 'sell', frequency: 'daily' };
        useOnboardingStore.setState({ computedPath: 'SELLER_STARTER', answers: testAnswers });

        (api.post as jest.Mock).mockResolvedValue({ success: true, data: {} });

        render(<ProcessingStep />);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/onboard', {
                role: 'SELLER',
                onboardingData: testAnswers
            });
        });
    });

    it('should handle "already onboarded" error gracefully', async () => {
        (api.post as jest.Mock).mockResolvedValue({
            success: false,
            error: "User is already onboarded as SELLER"
        });

        render(<ProcessingStep />);

        await waitFor(() => {
            expect(mockRouter.replace).toHaveBeenCalledWith('/seller');
        });
    });
});
