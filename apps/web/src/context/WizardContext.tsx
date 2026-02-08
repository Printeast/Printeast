"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our Wizard State
export interface WizardState {
    product: {
        id: string; // ID of the blank product selected
        title: string;
        description: string;
        tags: string[];
    };
    design: {
        state: any; // Canvas JSON
        previewUrl: string | null;
        hasDesign: boolean;
    };
    variants: {
        selected: string[]; // IDs or SKUs
        prices: Record<string, { retail: number; cost: number; profit: number }>;
    };
    settings: {
        profitMargin: number;
        includeShipping: boolean;
    };
    regions: string[];
}

interface WizardContextType {
    state: WizardState;
    updateProduct: (data: Partial<WizardState["product"]>) => void;
    updateDesign: (data: Partial<WizardState["design"]>) => void;
    updateVariants: (data: Partial<WizardState["variants"]>) => void;
    updateSettings: (data: Partial<WizardState["settings"]>) => void;
    saveAsTemplate: () => Promise<void>;
    publishProduct: () => Promise<void>;
    isSaving: boolean;
}

const defaultState: WizardState = {
    product: {
        id: "gildan-5000",
        title: "Heavyweight Unisex Crewneck T-shirt",
        description: "",
        tags: [],
    },
    design: {
        state: null,
        previewUrl: null,
        hasDesign: false,
    },
    variants: {
        selected: [],
        prices: {},
    },
    settings: {
        profitMargin: 50,
        includeShipping: false,
    },
    regions: ["North America", "Europe"],
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<WizardState>(defaultState);
    const [isSaving, setIsSaving] = useState(false);

    // Hydrate from localStorage on mount (optional, for "robustness" against refresh)
    useEffect(() => {
        const saved = localStorage.getItem("wizard_state");
        if (saved) {
            try {
                setState(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse wizard state", e);
            }
        }
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem("wizard_state", JSON.stringify(state));
    }, [state]);

    const updateProduct = React.useCallback((data: Partial<WizardState["product"]>) => {
        setState((prev) => ({ ...prev, product: { ...prev.product, ...data } }));
    }, []);

    const updateDesign = React.useCallback((data: Partial<WizardState["design"]>) => {
        setState((prev) => ({ ...prev, design: { ...prev.design, ...data } }));
    }, []);

    const updateVariants = React.useCallback((data: Partial<WizardState["variants"]>) => {
        setState((prev) => ({ ...prev, variants: { ...prev.variants, ...data } }));
    }, []);

    const updateSettings = React.useCallback((data: Partial<WizardState["settings"]>) => {
        setState((prev) => ({ ...prev, settings: { ...prev.settings, ...data } }));
    }, []);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const saveAsTemplate = async () => {
        setIsSaving(true);
        try {
            const { saveWizardTemplate } = await import("@/actions/wizard");
            const result = await saveWizardTemplate(state);

            if (result.success) {
                console.log("Template saved successfully");
                showToast("New Template Saved Successfully!");
                router.push("/seller/templates");
            } else {
                console.error("Failed to save template:", result.error);
                // Optional: Show error toast
            }
        } catch (error) {
            console.error("Error saving template:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const publishProduct = async () => {
        setIsSaving(true);
        try {
            const { publishWizardProduct } = await import("@/actions/wizard");
            const result = await publishWizardProduct(state);

            if (result.success) {
                console.log("Product published successfully", result.productId);
                showToast("Product Published Successfully!");
                // Clear state or redirect
                // setState(defaultState); // Optional: clear wizard
                router.push("/seller/inventory");
            } else {
                console.error("Failed to publish product:", result.error);
                showToast("Failed to publish product.");
            }
        } catch (error) {
            console.error("Error publishing product:", error);
            showToast("An error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <WizardContext.Provider
            value={{
                state,
                updateProduct,
                updateDesign,
                updateVariants,
                updateSettings,
                saveAsTemplate,
                publishProduct,
                isSaving,
            }}
        >
            {children}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-[#1a1a24] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="text-sm font-bold">{toastMessage}</span>
                    </div>
                </div>
            )}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error("useWizard must be used within a WizardProvider");
    }
    return context;
}
