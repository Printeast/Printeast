import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPath = 'INDIVIDUAL' | 'SELLER_STARTER' | 'SELLER_EXPANDING' | 'ARTIST' | 'NON_PROFIT' | null;

export type StepName =
    | 'GOAL'
    | 'PRODUCT_INTEREST'
    | 'DISCOVERY_CHANNEL'
    | 'LOCATION'
    | 'SALES_VOLUME'
    | 'POD_JOURNEY'
    | 'NON_PROFIT_INTENTION'
    | 'USE_CASE'
    | 'AI_TOOLS'
    | 'PROCESSING';

interface OnboardingState {
    currentStep: StepName;
    history: StepName[];
    answers: Record<string, any>;
    computedPath: UserPath;

    // Actions
    setAnswer: (key: string, value: any) => void;
    goToStep: (step: StepName) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;

    // Helpers
    calculatePath: () => UserPath;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            currentStep: 'GOAL',
            history: [],
            answers: {},
            computedPath: null,

            setAnswer: (key: string, value: any) => {
                set((state: OnboardingState) => {
                    const newAnswers = { ...state.answers, [key]: value };

                    let newPath = state.computedPath;

                    // Update path logic based on new journey options
                    if (key === 'podJourney' && value === 'I want to support my community or cause through merchandise') {
                        newPath = 'NON_PROFIT';
                    }
                    else if (key === 'goal') {
                        if (value === 'I want to sell my artwork as an Artist') {
                            newPath = 'ARTIST';
                        } else if (value === 'I want to shop for myself') {
                            newPath = 'INDIVIDUAL';
                        } else if (value === 'I want to launch an online business') {
                            newPath = 'SELLER_STARTER';
                        } else if (value === 'I want to grow my business') {
                            newPath = 'SELLER_EXPANDING';
                        }
                    }
                    else if (key === 'podJourney') {
                        // Infer path from journey if not already set by goal
                        if (value === "I want to scale my existing business with better fulfillment") {
                            newPath = 'SELLER_EXPANDING';
                        } else if (value === "I want to start a side-hustle with zero upfront inventory") {
                            newPath = 'SELLER_STARTER';
                        } else if (!state.computedPath) {
                            newPath = 'SELLER_STARTER'; // Default fallback
                        }
                    }

                    return {
                        answers: newAnswers,
                        computedPath: newPath
                    };
                });
            },

            goToStep: (step: StepName) => set((state: OnboardingState) => ({
                currentStep: step,
                history: [...state.history, state.currentStep]
            })),

            nextStep: () => {
                const { currentStep, answers, goToStep, computedPath } = get();
                const isIndividual = answers.goal === 'I want to shop for myself';
                const isNonProfit = computedPath === 'NON_PROFIT' || answers.podJourney === 'I want to support my community or cause through merchandise';

                let next: StepName = 'PROCESSING';

                switch (currentStep) {
                    case 'GOAL':
                        if (isIndividual) {
                            next = 'PRODUCT_INTEREST';
                        } else {
                            next = 'LOCATION';
                        }
                        break;

                    case 'LOCATION':
                        next = 'POD_JOURNEY';
                        break;

                    case 'POD_JOURNEY':
                        if (isNonProfit) {
                            next = 'NON_PROFIT_INTENTION';
                        } else {
                            next = 'PRODUCT_INTEREST';
                        }
                        break;

                    case 'NON_PROFIT_INTENTION':
                        next = 'PRODUCT_INTEREST';
                        break;

                    case 'PRODUCT_INTEREST':
                        if (isIndividual) {
                            next = 'DISCOVERY_CHANNEL';
                        } else {
                            // Both Sellers, Artists, and Non-Profits go to Sales Volume now
                            next = 'SALES_VOLUME';
                        }
                        break;

                    case 'SALES_VOLUME':
                        next = 'USE_CASE';
                        break;

                    case 'USE_CASE':
                        next = 'DISCOVERY_CHANNEL';
                        break;

                    case 'DISCOVERY_CHANNEL':
                        next = 'PROCESSING';
                        break;

                    // Unused paths
                    case 'AI_TOOLS':
                        next = 'PROCESSING';
                        break;

                    default:
                        next = 'PROCESSING';
                }

                goToStep(next);
            },

            prevStep: () => set((state: OnboardingState) => {
                if (state.currentStep === 'PROCESSING') return {}; // Lock navigation during processing
                const prev = state.history[state.history.length - 1];
                if (!prev) return {};
                const newHistory = state.history.slice(0, -1);
                return { currentStep: prev, history: newHistory };
            }),

            reset: () => set({
                currentStep: 'GOAL',
                history: [],
                answers: {},
                computedPath: null
            }),

            calculatePath: () => get().computedPath
        }),
        {
            name: 'onboarding-storage',
            skipHydration: true,
        }
    )
);
