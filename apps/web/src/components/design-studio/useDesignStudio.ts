"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { designService, DesignData } from "@/services/design.service";
import { get, set, del } from "idb-keyval";
import { compressDesignPreview } from "@/utils/image-compression";

interface UseDesignStudioOptions {
    designId?: string | undefined;
    startFresh?: boolean;
    autoSaveInterval?: number | undefined; // ms, default 30000 (30s)
}

export function useDesignStudio(options: UseDesignStudioOptions = {}) {
    const { designId, autoSaveInterval = 30000 } = options;

    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
    const [currentDesign, setCurrentDesign] = useState<DesignData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const previewThrottleRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedDataRef = useRef<string | null>(null);
    const lastPreviewTimeRef = useRef<number>(0);
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isCreatingRef = useRef<boolean>(false);

    // Track history
    const saveHistory = useCallback(() => {
        if (!canvas) return;
        const json = JSON.stringify(canvas.toJSON());

        // Don't save if same as last
        if (historyIndexRef.current >= 0 && historyRef.current[historyIndexRef.current] === json) {
            return;
        }

        // Remove any future history if we're in the middle of the stack
        const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        newHistory.push(json);

        // Limit history size to 50 for performance
        if (newHistory.length > 50) {
            newHistory.shift();
        } else {
            historyIndexRef.current++;
        }

        historyRef.current = newHistory;
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(false);
        setHasUnsavedChanges(true);
    }, [canvas]);

    // Auto-save (silent, no UI feedback)
    const autoSave = useCallback(async () => {
        if (!canvas || !currentDesign?.id) return;

        const currentData = JSON.stringify(canvas.toJSON());

        // Skip if no actual changes
        if (currentData === lastSavedDataRef.current) {
            setHasUnsavedChanges(false);
            return;
        }

        try {
            await designService.autoSave(currentDesign.id, JSON.parse(currentData));
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            lastSavedDataRef.current = currentData;
        } catch (err) {
            console.error("Auto-save failed:", err);
        }
    }, [canvas, currentDesign?.id]);

    // Create new design
    const createDesign = useCallback(async () => {
        if (!canvas || isCreatingRef.current) return null;

        isCreatingRef.current = true;
        setIsSaving(true);
        setError(null);

        try {
            const designData = canvas.toJSON();
            const response = await designService.create({
                designData,
                status: "DRAFT",
            });

            if (response.success && response.data) {
                const design = response.data;
                setCurrentDesign(design);

                // Persist ID
                if (design.id) {
                    await set("printeast_wizard_design_id", design.id);
                }

                // Cache full state for instant reload
                await set("printeast_design_json", JSON.stringify(designData));

                setLastSaved(new Date());
                setHasUnsavedChanges(false);
                lastSavedDataRef.current = JSON.stringify(designData);
                return design;
            } else {
                setError(response.message || "Failed to create design");
                return null;
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Failed to create design";
            setError(msg);
            return null;
        } finally {
            setIsSaving(false);
            isCreatingRef.current = false;
        }
    }, [canvas]);

    // Save preview to IndexedDB for Wizard flow
    const savePreviewToIndexedDB = useCallback(async () => {
        if (!canvas) return;

        try {
            // 1. Export RAW DESIGN (Transparent - for Mockup Generator)
            const objects = canvas.getObjects();
            const printArea = objects.find(obj => (obj as any).data?.type === 'printArea');
            const printLabel = objects.find(obj => (obj as any).data?.type === 'printLabel');
            const originalBg = canvas.backgroundImage as fabric.Image;

            // Hide non-content elements for export
            canvas.backgroundImage = null as any;
            if (printArea) printArea.set('visible', false);
            if (printLabel) printLabel.set('visible', false);

            // Calculate export area
            // We now prioritize the 'Print Area' guide if it exists
            let exportOptions: any = {
                format: 'png',
                quality: 1,
                multiplier: 3, // High-res for crisp mockup integration
                enableRetinaScaling: true,
            };

            if (printArea) {
                const bounds = printArea.getBoundingRect();
                exportOptions.left = bounds.left;
                exportOptions.top = bounds.top;
                exportOptions.width = bounds.width;
                exportOptions.height = bounds.height;
            } else if (originalBg) {
                const bounds = originalBg.getBoundingRect();
                exportOptions.left = bounds.left;
                exportOptions.top = bounds.top;
                exportOptions.width = bounds.width;
                exportOptions.height = bounds.height;
            } else {
                exportOptions.left = 0;
                exportOptions.top = 0;
                exportOptions.width = canvas.width;
                exportOptions.height = canvas.height;
            }

            const designAsset = canvas.toDataURL(exportOptions);

            // Restore elements
            canvas.backgroundImage = originalBg as any;
            if (printArea) {
                printArea.set('visible', true);
            }
            if (printLabel) {
                printLabel.set('visible', true);
            }
            canvas.requestRenderAll();

            // Get raw base64 (standard quality is fine for compression source)
            const rawPreview = canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 1,
            });

            // Now safe to await async operations
            // Save raw asset to IDB
            await set("printeast_design_asset", designAsset);

            // Compress for dashboard (JPEG, smaller dimensions)
            const compressedPreview = await compressDesignPreview(rawPreview, 0.7, 800);

            // Save visual preview to IDB
            await set("printeast_design_preview", compressedPreview);

            // 3. Trigger events & Update Backend
            window.dispatchEvent(new Event("printeast-preview-updated"));

            if (currentDesign?.id) {
                console.log("Saving preview to backend for design:", currentDesign.id);
                await designService.update(currentDesign.id, {
                    previewUrl: compressedPreview,
                    imageUrl: compressedPreview
                });
                console.log("Preview saved to backend successfully");
            }

        } catch (e) {
            console.error("Failed to save preview", e);
        }
    }, [canvas, currentDesign?.id]);

    // TIER 1: Instant local save (no debounce) - for buttery smooth dragging
    const instantLocalSave = useCallback(() => {
        if (!canvas) return;
        try {
            // Save to IndexedDB immediately (async but non-blocking)
            set("printeast_design_json", JSON.stringify(canvas.toJSON()));
        } catch (e) {
            console.error("Failed instant local save", e);
        }
    }, [canvas]);

    // TIER 2: Debounced backend sync (2s) - happens when user pauses
    const debouncedBackendSync = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(async () => {
            if (currentDesign?.id) {
                autoSave();
            } else if (!isCreatingRef.current && hasUnsavedChanges) {
                // If no ID yet, create the design record
                await createDesign();
            }
        }, 2000); // 2-second debounce (longer for backend)
    }, [autoSave, currentDesign?.id, createDesign, hasUnsavedChanges]);

    // TIER 3: Throttled preview update (3s) - most expensive operation
    const throttledPreviewUpdate = useCallback(() => {
        const now = Date.now();
        const timeSinceLastPreview = now - lastPreviewTimeRef.current;

        // Only update preview if at least 3 seconds have passed
        if (timeSinceLastPreview >= 3000) {
            lastPreviewTimeRef.current = now;
            savePreviewToIndexedDB();
        } else {
            // Schedule for later if called too soon
            if (previewThrottleRef.current) {
                clearTimeout(previewThrottleRef.current);
            }
            previewThrottleRef.current = setTimeout(() => {
                lastPreviewTimeRef.current = Date.now();
                savePreviewToIndexedDB();
            }, 3000 - timeSinceLastPreview);
        }
    }, [savePreviewToIndexedDB]);



    const undo = useCallback(async () => {
        if (!canvas || historyIndexRef.current <= 0) return;

        historyIndexRef.current--;
        const json = JSON.parse(historyRef.current[historyIndexRef.current]!);

        await canvas.loadFromJSON(json);
        canvas.requestRenderAll();

        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(true);
        setHasUnsavedChanges(true);
        instantLocalSave();
        debouncedBackendSync();
    }, [canvas, instantLocalSave, debouncedBackendSync]);

    const redo = useCallback(async () => {
        if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

        historyIndexRef.current++;
        const json = JSON.parse(historyRef.current[historyIndexRef.current]!);

        await canvas.loadFromJSON(json);
        canvas.requestRenderAll();

        setCanUndo(true);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        setHasUnsavedChanges(true);
        instantLocalSave();
        debouncedBackendSync();
    }, [canvas, instantLocalSave, debouncedBackendSync]);

    // Load design from backend
    const loadDesign = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await designService.getById(id);
            if (response.success && response.data) {
                setCurrentDesign(response.data);

                // Load canvas state if canvas is ready
                if (canvas && response.data?.designData) {
                    console.log("Loading design JSON to canvas...");
                    const designData = response.data.designData;
                    await new Promise<void>((resolve) => {
                        canvas.loadFromJSON(designData, () => {
                            console.log("Canvas loaded from JSON");
                            canvas.requestRenderAll();
                            resolve();
                        });
                    });

                    const jsonStr = JSON.stringify(designData);
                    lastSavedDataRef.current = jsonStr;

                    // Reset history on load
                    historyRef.current = [jsonStr];
                    historyIndexRef.current = 0;
                    setCanUndo(false);
                    setCanRedo(false);
                }
            } else {
                setError(response.message || "Failed to load design");
            }
        } catch (err: any) {
            setError(err.message || "Failed to load design");
        } finally {
            setIsLoading(false);
        }
    }, [canvas]);

    // Load existing design if designId is provided or found in IndexedDB
    useEffect(() => {
        const init = async () => {
            // FORCE NEW SESSION
            if (options.startFresh) {
                console.log("Starting fresh session: Clearing cache");
                await del("printeast_design_json");
                await del("printeast_wizard_design_id");
                // Do not load anything, canvas starts empty
                return;
            }

            if (designId) {
                loadDesign(designId);
            } else {
                try {
                    // OPTIMISTIC LOAD: Try to load from IndexedDB first
                    const cachedJson = await get("printeast_design_json");
                    const savedId = await get("printeast_wizard_design_id");

                    if (cachedJson && canvas) {
                        try {
                            const json = JSON.parse(cachedJson);
                            canvas.loadFromJSON(json, () => {
                                canvas.requestRenderAll();
                                // Force update preview on load
                                setTimeout(() => savePreviewToIndexedDB(), 500);
                            });
                            // Still fetch from DB to sync
                            if (savedId) {
                                loadDesign(savedId);
                            }
                        } catch (e) {
                            console.error("Failed to load cached design", e);
                            if (savedId) loadDesign(savedId);
                        }
                    } else if (savedId) {
                        loadDesign(savedId);
                    }
                } catch (err) {
                    console.error("Failed to initialize from IndexedDB", err);
                } finally {
                    // Even if empty found, ensure we have a preview of the base product
                    setTimeout(() => savePreviewToIndexedDB(), 1000);
                }
            }
        };

        if (canvas) {
            init();
        }
    }, [designId, loadDesign, canvas]);

    // Setup canvas listeners
    useEffect(() => {
        if (!canvas) return;

        // Discrete changes (add/remove/finish modifying)
        const handleChange = () => {
            saveHistory();
            instantLocalSave(); // Instant local
            debouncedBackendSync(); // Backend after pause
            throttledPreviewUpdate(); // Preview occasionally
        };

        // Continuous changes (dragging/scaling/rotating)
        const handleMoving = () => {
            // ONLY save locally during movement (buttery smooth)
            instantLocalSave();
            // Backend sync will happen when they stop (via handleChange on object:modified)
        };

        canvas.on("object:modified", handleChange);
        canvas.on("object:added", handleChange);
        canvas.on("object:removed", handleChange);
        canvas.on("object:moving", handleMoving);
        canvas.on("object:scaling", handleMoving);
        canvas.on("object:rotating", handleMoving);

        // Initial state
        if (historyRef.current.length === 0) {
            const initialJson = JSON.stringify(canvas.toJSON());
            historyRef.current = [initialJson];
            historyIndexRef.current = 0;
        }

        // Auto-save timer (fallback)
        autoSaveTimerRef.current = setInterval(() => {
            if (hasUnsavedChanges && currentDesign?.id) {
                autoSave();
            }
        }, autoSaveInterval);

        return () => {
            canvas.off("object:modified", handleChange);
            canvas.off("object:added", handleChange);
            canvas.off("object:removed", handleChange);
            canvas.off("object:moving", handleMoving);
            canvas.off("object:scaling", handleMoving);
            canvas.off("object:rotating", handleMoving);
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (previewThrottleRef.current) {
                clearTimeout(previewThrottleRef.current);
            }
        };
    }, [canvas, currentDesign?.id, hasUnsavedChanges, autoSaveInterval, saveHistory, debouncedBackendSync, autoSave]);



    // Save design
    const saveDesign = useCallback(async () => {
        if (!canvas) return false;

        setIsSaving(true);
        setError(null);

        try {
            const designData = canvas.toJSON();

            // If no current design, create new
            if (!currentDesign?.id) {
                const newDesign = await createDesign();
                return !!newDesign;
            }

            // Update existing
            const response = await designService.update(currentDesign.id, { designData });

            // Force preview update on manual save
            await savePreviewToIndexedDB();

            if (response.success) {
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
                lastSavedDataRef.current = JSON.stringify(designData);
                return true;
            } else {
                setError(response.message || "Failed to save design");
                return false;
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Failed to save design";
            setError(msg);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [canvas, currentDesign?.id, createDesign, savePreviewToIndexedDB]);

    // Export design as image
    const exportAsImage = useCallback(async () => {
        if (!canvas) return null;

        try {
            const dataUrl = await designService.exportAsImage(canvas);
            return dataUrl;
        } catch (err: any) {
            setError(err.message || "Failed to export design");
            return null;
        }
    }, [canvas]);

    // Delete design
    const deleteDesign = useCallback(async () => {
        if (!currentDesign?.id) return false;

        try {
            const response = await designService.delete(currentDesign.id);
            if (response.success) {
                setCurrentDesign(null);
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || "Failed to delete design");
            return false;
        }
    }, [currentDesign?.id]);

    // Duplicate design
    const duplicateDesign = useCallback(async () => {
        if (!currentDesign?.id) return null;

        try {
            const response = await designService.duplicate(currentDesign.id);
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || "Failed to duplicate design");
            return null;
        }
    }, [currentDesign?.id]);

    // Add text to canvas
    const addText = useCallback((text: string, options: any = {}) => {
        if (!canvas) return;
        const textObj = new fabric.IText(text, {
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            fontFamily: "Inter",
            fill: "#000000",
            fontSize: 40,
            originX: "center",
            originY: "center",
            ...options
        });
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.requestRenderAll();
        saveHistory();
        instantLocalSave();
        debouncedBackendSync();
        throttledPreviewUpdate();
    }, [canvas, saveHistory, instantLocalSave, debouncedBackendSync, throttledPreviewUpdate]);

    // Add image to canvas
    const addImage = useCallback((url: string) => {
        if (!canvas) return;
        fabric.Image.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
            if (img.width && img.width > 300) {
                img.scaleToWidth(300);
            }
            img.set({
                left: canvas.width! / 2,
                top: canvas.height! / 2,
                originX: "center",
                originY: "center",
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
            saveHistory();
            instantLocalSave();
            debouncedBackendSync();
            throttledPreviewUpdate();
        });
    }, [canvas, saveHistory, instantLocalSave, debouncedBackendSync, throttledPreviewUpdate]);

    // Delete selected object
    const deleteObject = useCallback(() => {
        if (!canvas || !activeObject) return;
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        setActiveObject(null);
        saveHistory();
        instantLocalSave();
        debouncedBackendSync();
        throttledPreviewUpdate();
    }, [canvas, activeObject, saveHistory, instantLocalSave, debouncedBackendSync, throttledPreviewUpdate]);

    // Move object in layer stack
    const moveObject = useCallback((direction: "up" | "down" | "top" | "bottom") => {
        if (!canvas || !activeObject) return;

        switch (direction) {
            case "up":
                canvas.bringObjectForward(activeObject);
                break;
            case "down":
                canvas.sendObjectBackwards(activeObject);
                break;
            case "top":
                canvas.bringObjectToFront(activeObject);
                break;
            case "bottom":
                canvas.sendObjectToBack(activeObject);
                break;
        }
        canvas.requestRenderAll();
        saveHistory();
        instantLocalSave();
        debouncedBackendSync();
        throttledPreviewUpdate();
    }, [canvas, activeObject, saveHistory, instantLocalSave, debouncedBackendSync, throttledPreviewUpdate]);

    // Snapping logic
    useEffect(() => {
        if (!canvas) return;

        const handleObjectMoving = (e: any) => {
            const obj = e.target;
            const canvasWidth = canvas.width || 0;
            const canvasHeight = canvas.height || 0;

            // Snap to center
            if (Math.abs(obj.left - canvasWidth / 2) < 10) {
                obj.set({ left: canvasWidth / 2 });
            }
            if (Math.abs(obj.top - canvasHeight / 2) < 10) {
                obj.set({ top: canvasHeight / 2 });
            }
        };

        canvas.on('object:moving', handleObjectMoving);

        return () => {
            canvas.off('object:moving', handleObjectMoving);
        };
    }, [canvas]);

    return {
        // Canvas state
        canvas,
        setCanvas,
        activeObject,
        setActiveObject,

        // Design state
        currentDesign,
        isLoading,
        isSaving,
        lastSaved,
        hasUnsavedChanges,
        error,
        canUndo,
        canRedo,

        // Design CRUD
        loadDesign,
        createDesign,
        saveDesign,
        deleteDesign,
        duplicateDesign,
        exportAsImage,

        // Canvas operations
        addText,
        addImage,
        deleteObject,
        moveObject,
        undo,
        redo,
    };
}
