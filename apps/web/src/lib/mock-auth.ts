type Role = "CREATOR" | "SELLER";

const ROLE_PATH: Record<Role, string> = {
    CREATOR: "creator",
    SELLER: "seller",
};

const STORAGE_KEY = "printeast_mock_user";

export const isMockAuthEnabled = () => process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || process.env.NEXT_PUBLIC_MOCK_AUTH === undefined;

export const setMockUser = (role: Role) => {
    if (typeof window === "undefined") return;
    const user = { id: `mock-${role.toLowerCase()}`, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
};

export const getMockUser = () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as { id: string; role: Role };
    } catch {
        return null;
    }
};

export const clearMockUser = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
};

export const getRolePath = (role: Role) => `/${ROLE_PATH[role]}`;

export const TEST_USERS: Array<{ label: string; role: Role }> = [
    { label: "Creator (test)", role: "CREATOR" },
    { label: "Seller (test)", role: "SELLER" },
];
