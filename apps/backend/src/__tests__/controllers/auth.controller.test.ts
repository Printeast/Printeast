/**
 * BRUTAL AUTH CONTROLLER TESTS
 * 
 * Tests the HTTP layer for onboarding:
 * - Proper status codes (200, not 403 for already onboarded)
 * - Request validation
 * - Response format
 * - Error handling
 */

import { Request, Response, NextFunction } from 'express';
import { createMockUser } from '../setup';

// Mock the onboarding service
// REALISTIC MOCK: Simulate network/DB latency
jest.mock('../../services/onboarding.service', () => ({
    performOnboarding: jest.fn().mockImplementation(async () => {
        await new Promise(r => setTimeout(r, 10)); // Simulate 10ms processing
        return { success: true };
    }),
    checkOnboardingStatus: jest.fn(),
    prewarmUserCache: jest.fn().mockImplementation(async () => {
        await new Promise(r => setTimeout(r, 5));
        return undefined;
    }),
}));

import { onboard, checkOnboardingStatus as checkOnboardingStatusController } from '../../controllers/auth.controller';
import { performOnboarding, checkOnboardingStatus } from '../../services/onboarding.service';

describe('AuthController - Onboarding', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockReq = {
            body: {},
            user: { userId: 'test-user-123' },
        } as any;

        mockRes = {
            status: statusMock,
            json: jsonMock,
        };

        mockNext = jest.fn();
    });

    // ============================================================
    // SECTION 1: ONBOARD ENDPOINT TESTS
    // ============================================================
    describe('POST /auth/onboard', () => {

        describe('Validation', () => {

            it('should return 401 when user context is missing', async () => {
                (mockReq as any).user = undefined;
                mockReq.body = { role: 'SELLER' };

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(mockNext).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: 'User context required',
                        statusCode: 401,
                    })
                );
            });

            it('should return 400 when role is missing', async () => {
                mockReq.body = {};

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(mockNext).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: 'Role required',
                        statusCode: 400,
                    })
                );
            });

            it('should return 400 for invalid role', async () => {
                mockReq.body = { role: 'ADMIN' }; // Not allowed

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(mockNext).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: 'Invalid role selection',
                        statusCode: 400,
                    })
                );
            });

            it('should accept valid roles: SELLER, CREATOR, CUSTOMER', async () => {
                const validRoles = ['SELLER', 'CREATOR', 'CUSTOMER'];

                for (const role of validRoles) {
                    mockReq.body = { role };
                    (performOnboarding as jest.Mock).mockResolvedValue({
                        success: true,
                        user: createMockUser(),
                        redirectTo: `/${role.toLowerCase()}`,
                        alreadyOnboarded: false,
                    });

                    await (onboard as any)(mockReq, mockRes, mockNext);

                    expect(statusMock).toHaveBeenCalledWith(200);
                }
            });
        });

        describe('Response Format', () => {

            it('should return 200 with correct structure for new onboarding', async () => {
                mockReq.body = { role: 'SELLER' };
                (performOnboarding as jest.Mock).mockResolvedValue({
                    success: true,
                    user: createMockUser({ roles: [{ role: { name: 'SELLER' } }] }),
                    redirectTo: '/seller',
                    alreadyOnboarded: false,
                });

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(statusMock).toHaveBeenCalledWith(200);
                expect(jsonMock).toHaveBeenCalledWith({
                    success: true,
                    data: { user: expect.any(Object) },
                    redirectTo: '/seller',
                    alreadyOnboarded: false,
                    cached: undefined,
                });
            });

            it('should return 200 (NOT 403!) for already onboarded users', async () => {
                mockReq.body = { role: 'SELLER' };
                (performOnboarding as jest.Mock).mockResolvedValue({
                    success: true,
                    user: createMockUser({ roles: [{ role: { name: 'SELLER' } }] }),
                    redirectTo: '/seller',
                    alreadyOnboarded: true,
                    cached: true,
                });

                await (onboard as any)(mockReq, mockRes, mockNext);

                // CRITICAL: Must be 200, not 403!
                expect(statusMock).toHaveBeenCalledWith(200);
                expect(jsonMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        success: true,
                        alreadyOnboarded: true,
                    })
                );
            });

            it('should include redirectTo in response', async () => {
                mockReq.body = { role: 'CREATOR' };
                (performOnboarding as jest.Mock).mockResolvedValue({
                    success: true,
                    user: createMockUser(),
                    redirectTo: '/creator',
                    alreadyOnboarded: false,
                });

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(jsonMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        redirectTo: '/creator',
                    })
                );
            });

            it('should include cached flag for debugging', async () => {
                mockReq.body = { role: 'SELLER' };
                (performOnboarding as jest.Mock).mockResolvedValue({
                    success: true,
                    user: createMockUser(),
                    redirectTo: '/seller',
                    alreadyOnboarded: true,
                    cached: true,
                });

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(jsonMock).toHaveBeenCalledWith(
                    expect.objectContaining({
                        cached: true,
                    })
                );
            });
        });

        describe('Service Integration', () => {

            it('should pass all parameters to onboarding service', async () => {
                mockReq.body = {
                    role: 'SELLER',
                    businessName: 'My Store',
                    onboardingData: { location: 'US' },
                };
                (performOnboarding as jest.Mock).mockResolvedValue({
                    success: true,
                    user: createMockUser(),
                    redirectTo: '/seller',
                    alreadyOnboarded: false,
                });

                await (onboard as any)(mockReq, mockRes, mockNext);

                expect(performOnboarding).toHaveBeenCalledWith({
                    userId: 'test-user-123',
                    role: 'SELLER',
                    businessName: 'My Store',
                    onboardingData: { location: 'US' },
                });
            });
        });
    });

    // ============================================================
    // SECTION 2: ONBOARD STATUS CHECK ENDPOINT
    // ============================================================
    describe('GET /auth/onboard-status', () => {

        it('should return 401 when not authenticated', async () => {
            (mockReq as any).user = undefined;

            await (checkOnboardingStatusController as any)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Unauthorized',
                    statusCode: 401,
                })
            );
        });

        it('should return onboarded=true with redirectTo when user is onboarded', async () => {
            (checkOnboardingStatus as jest.Mock).mockResolvedValue({
                success: true,
                redirectTo: '/seller',
                cached: true,
            });

            await (checkOnboardingStatusController as any)(mockReq, mockRes, mockNext);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                onboarded: true,
                redirectTo: '/seller',
                cached: true,
            });
        });

        it('should return onboarded=false when user needs onboarding', async () => {
            (checkOnboardingStatus as jest.Mock).mockResolvedValue(null);

            await (checkOnboardingStatusController as any)(mockReq, mockRes, mockNext);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                onboarded: false,
            });
        });
    });
});
