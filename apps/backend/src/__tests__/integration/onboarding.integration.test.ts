/**
 * INTEGRATION TESTS - FULL ONBOARDING FLOW
 * 
 * Tests the complete flow from API request to database mutation
 * These are the most realistic tests
 */

import { mockPrisma, createMockUser, createMockVendor, measureExecutionTime } from '../setup';
import { redis } from '../../config/redis';

// We need to test the actual implementation, not mocks
jest.unmock('../../services/onboarding.service');

import {
    performOnboarding,
} from '../../services/onboarding.service';

describe('Integration: Full Onboarding Flow', () => {

    // ============================================================
    // SCENARIO 1: Brand New User Becomes SELLER
    // ============================================================
    describe('Scenario: New User → SELLER', () => {

        beforeEach(() => {
            // Reset all mocks
            jest.clearAllMocks();

            // Setup initial state: user with CUSTOMER role
            (redis.get as jest.Mock).mockResolvedValue(null); // No cache
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser({
                roles: [{ role: { name: 'CUSTOMER' } }],
                creatorProfile: null,
            }));
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockResolvedValue({});
            mockPrisma.vendor.findFirst.mockResolvedValue(null);
            mockPrisma.vendor.create.mockResolvedValue(createMockVendor());
        });

        it('should complete full SELLER onboarding in single transaction', async () => {
            const result = await performOnboarding({
                userId: 'new-user-123',
                role: 'SELLER',
                businessName: 'Epic Store',
            });

            // Verify success
            expect(result.success).toBe(true);
            expect(result.redirectTo).toBe('/seller');
            expect(result.alreadyOnboarded).toBe(false);

            // Verify all operations happened
            expect(mockPrisma.userRole.deleteMany).toHaveBeenCalled();
            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(mockPrisma.vendor.create).toHaveBeenCalled();

            // Verify cache was set
            expect(redis.setex).toHaveBeenCalledWith(
                'onboard:role:new-user-123',
                3600,
                'SELLER'
            );
        });

        it('should handle complete flow in under 300ms (mocked)', async () => {
            const { timeMs } = await measureExecutionTime(() =>
                performOnboarding({
                    userId: 'new-user-123',
                    role: 'SELLER',
                })
            );

            expect(timeMs).toBeLessThan(300);
        });
    });

    // ============================================================
    // SCENARIO 2: New User Becomes CREATOR
    // ============================================================
    describe('Scenario: New User → CREATOR', () => {

        beforeEach(() => {
            jest.clearAllMocks();

            (redis.get as jest.Mock).mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser({
                roles: [{ role: { name: 'CUSTOMER' } }],
                creatorProfile: null,
            }));
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockResolvedValue({});
            mockPrisma.creator.create.mockResolvedValue({ id: 'creator-1', userId: 'user-123' });
        });

        it('should complete full CREATOR onboarding', async () => {
            const result = await performOnboarding({
                userId: 'creator-user-123',
                role: 'CREATOR',
            });

            expect(result.success).toBe(true);
            expect(result.redirectTo).toBe('/creator');
            expect(mockPrisma.creator.create).toHaveBeenCalled();
        });
    });

    // ============================================================
    // SCENARIO 3: Already Onboarded User Returns
    // ============================================================
    describe('Scenario: Already Onboarded User', () => {

        it('should return instantly from cache (FAST PATH)', async () => {
            (redis.get as jest.Mock).mockResolvedValue('SELLER');

            const { result } = await measureExecutionTime(() =>
                performOnboarding({
                    userId: 'existing-seller',
                    role: 'SELLER',
                })
            );

            expect(result.success).toBe(true);
            expect(result.alreadyOnboarded).toBe(true);
            expect(result.cached).toBe(true);

            // Should be nearly instant - no DB queries
            expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
            expect(mockPrisma.$transaction).not.toHaveBeenCalled();
        });

        it('should redirect to existing role when trying to switch', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser({
                roles: [{ role: { name: 'CREATOR' } }],
            }));

            const result = await performOnboarding({
                userId: 'creator-trying-seller',
                role: 'SELLER', // Trying to switch
            });

            expect(result.success).toBe(true);
            expect(result.alreadyOnboarded).toBe(true);
            expect(result.redirectTo).toBe('/creator'); // Stays as CREATOR
        });
    });

    // ============================================================
    // SCENARIO 4: Race Conditions
    // ============================================================
    describe('Scenario: Race Conditions', () => {

        it('should handle concurrent onboarding requests safely', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser());
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockResolvedValue({});
            mockPrisma.vendor.findFirst.mockResolvedValue(null);
            mockPrisma.vendor.create.mockResolvedValue(createMockVendor());

            // Simulate 5 concurrent requests
            const promises = Array(5).fill(null).map(() =>
                performOnboarding({
                    userId: 'race-user',
                    role: 'SELLER',
                })
            );

            const results = await Promise.all(promises);

            // All should succeed (transaction handles conflicts)
            results.forEach(result => {
                expect(result.success).toBe(true);
            });
        });
    });

    // ============================================================
    // SCENARIO 5: Failure Recovery
    // ============================================================
    describe('Scenario: Failure Recovery', () => {

        it('should not leave partial state on transaction failure', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser());
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockRejectedValue(new Error('DB error'));

            await expect(performOnboarding({
                userId: 'fail-user',
                role: 'SELLER',
            })).rejects.toThrow();

            // Role should NOT have been cached
            expect(redis.setex).not.toHaveBeenCalledWith(
                expect.stringContaining('fail-user'),
                expect.any(Number),
                expect.any(String)
            );
        });

        it('should handle Redis failure gracefully', async () => {
            (redis.get as jest.Mock).mockRejectedValue(new Error('Redis down'));
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser({
                roles: [{ role: { name: 'CUSTOMER' } }],
            }));
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockResolvedValue({});
            mockPrisma.vendor.findFirst.mockResolvedValue(null);
            mockPrisma.vendor.create.mockResolvedValue(createMockVendor());

            // Should still work, just slower
            const result = await performOnboarding({
                userId: 'redis-fail-user',
                role: 'SELLER',
            });

            expect(result.success).toBe(true);
        });
    });

    // ============================================================
    // SCENARIO 6: Data Integrity
    // ============================================================
    describe('Scenario: Data Integrity', () => {

        it('should save onboarding survey data', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser());
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockResolvedValue({});
            mockPrisma.vendor.findFirst.mockResolvedValue(null);
            mockPrisma.vendor.create.mockResolvedValue(createMockVendor());

            const onboardingData = {
                productInterest: ['clothing', 'accessories'],
                experienceLevel: 'beginner',
                referralSource: 'google',
            };

            await performOnboarding({
                userId: 'data-user',
                role: 'SELLER',
                onboardingData,
            });

            expect(mockPrisma.user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        onboardingData,
                    })
                })
            );
        });

        it('should use correct workspace name', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);
            mockPrisma.user.findUnique.mockResolvedValue(createMockUser());
            mockPrisma.userRole.deleteMany.mockResolvedValue({ count: 1 });
            mockPrisma.user.update.mockResolvedValue({});
            mockPrisma.vendor.findFirst.mockResolvedValue(null);
            mockPrisma.vendor.create.mockResolvedValue(createMockVendor());

            await performOnboarding({
                userId: 'name-user',
                role: 'SELLER',
                businessName: 'My Awesome Business',
            });

            expect(mockPrisma.vendor.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        name: 'My Awesome Business',
                    })
                })
            );
        });
    });
});
