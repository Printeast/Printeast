/**
 * FRONTEND TEST SETUP
 */

import '@testing-library/jest-dom';

// Mock Next.js router
const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
};

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/onboarding',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock API service
jest.mock('@/services/api.service', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// PROPER ZUSTAND MOCK
const defaultStoreState = {
    answers: {},
    computedPath: 'SELLER_STARTER',
    currentStep: 'PROCESSING',
    reset: jest.fn(),
    prevStep: jest.fn(),
    nextStep: jest.fn(),
};

let currentStoreState = { ...defaultStoreState };

const useOnboardingStoreMock: any = () => currentStoreState;
useOnboardingStoreMock.setState = (fn: any) => {
    const newState = typeof fn === 'function' ? fn(currentStoreState) : fn;
    currentStoreState = { ...currentStoreState, ...newState };
};
useOnboardingStoreMock.getState = () => currentStoreState;

jest.mock('@/lib/stores/onboarding-store', () => ({
    useOnboardingStore: useOnboardingStoreMock,
}));

// Standardize measurements
(global as any).performance = { now: jest.fn(() => Date.now()) };

// Reset between tests
afterEach(() => {
    jest.clearAllMocks();
    currentStoreState = { ...defaultStoreState };
});

export { mockRouter, useOnboardingStoreMock };
