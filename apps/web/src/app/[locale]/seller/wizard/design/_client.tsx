"use client";

import { useEffect } from "react";
import { DesignStudio } from "@/components/design-studio";
import { useWizard } from "@/context/WizardContext";
import { get } from "idb-keyval";

export function DesignStudioClient() {
    const { updateDesign } = useWizard();

    // Sync Design Studio state (from IndexedDB/Events) to Wizard Context
    useEffect(() => {
        const syncState = async () => {
            try {
                const previewUrl = await get("printeast_design_preview");
                const designJson = await get("printeast_design_json");

                if (previewUrl || designJson) {
                    updateDesign({
                        previewUrl: previewUrl || null,
                        state: designJson ? JSON.parse(designJson) : null,
                        hasDesign: !!designJson
                    });
                }
            } catch (e) {
                console.error("Failed to sync design state", e);
            }
        };

        // Initial sync
        syncState();

        // Listen for updates from DesignStudio
        const handleUpdate = () => syncState();
        window.addEventListener("printeast-preview-updated", handleUpdate);

        // Also listen for general storage events (cross-tab)
        window.addEventListener("storage", handleUpdate);

        return () => {
            window.removeEventListener("printeast-preview-updated", handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, [updateDesign]);

    return (
        <DesignStudio
            initialMode="wizard"
            productImage="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
            startFresh={false} // Persist state across wizard steps
        />
    );
}

