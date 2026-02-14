import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    id: string;
    email: string;
    onboardingData?: {
        initialRole?: string;
        [key: string]: any;
    };
    roles?: Array<{
        role: {
            name: string;
        };
    }>;
    [key: string]: any;
}

interface UserState {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile | null) => void;
    clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: null,
            setProfile: (profile) => set({ profile }),
            clearProfile: () => set({ profile: null }),
        }),
        {
            name: 'user-profile-storage',
        }
    )
);
