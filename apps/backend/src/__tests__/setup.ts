/**
 * GLOBAL TEST SETUP
 * Mocks Redis, Prisma, and other external dependencies
 */

// Mock environment variables
jest.mock('../config/env', () => ({
    env: {
        REDIS_URL: 'redis://localhost:6379',
        JWT_ACCESS_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_ANON_KEY: 'test-key',
    }
}));

// Mock ioredis
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        set: jest.fn(),
        setex: jest.fn(),
        del: jest.fn(),
        on: jest.fn(),
    }));
});

// Mock Redis config
jest.mock('../config/redis', () => ({
    redis: {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        setex: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        keys: jest.fn().mockResolvedValue([]),
    },
    redisSubscriber: {
        subscribe: jest.fn(),
        on: jest.fn(),
    }
}));

// Mock Prisma
const mockPrisma: any = {
    user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
    },
    userRole: {
        deleteMany: jest.fn(),
        create: jest.fn(),
    },
    vendor: {
        findFirst: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
    },
    creator: {
        findUnique: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
    },
    $transaction: jest.fn(async (fn: any) => {
        try {
            return await fn(mockPrisma);
        } catch (e) {
            throw e; // Ensure errors roll back the transaction in the mock
        }
    }),
};

jest.mock('@repo/database', () => ({
    prisma: mockPrisma,
}));

// Export for use in tests
export { mockPrisma };

// Global test utilities
export const createMockUser = (overrides = {}) => ({
    id: 'test-user-id-123',
    email: 'test@example.com',
    tenantId: 'test-tenant-id-456',
    status: 'ACTIVE',
    roles: [{ role: { name: 'CUSTOMER' } }],
    creatorProfile: null,
    ...overrides,
});

export const createMockVendor = (overrides = {}) => ({
    id: 'test-vendor-id-789',
    name: 'Test Store',
    tenantId: 'test-tenant-id-456',
    ...overrides,
});

// Performance tracking
export const measureExecutionTime = async <T>(fn: () => Promise<T>): Promise<{ result: T; timeMs: number }> => {
    const start = performance.now();
    const result = await fn();
    const timeMs = performance.now() - start;
    return { result, timeMs };
};

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(async () => {
    jest.restoreAllMocks();
});
