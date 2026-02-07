"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Toolbar } from "./Toolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { useDesignStudio } from "./useDesignStudio";
import { Canvas } from "./Canvas";
import {
    Undo2, Redo2, Minus, Plus, Save, Loader2, Check
} from "lucide-react";

interface DesignStudioProps {
    initialMode?: "wizard" | "standalone";
    productImage?: string;
    productName?: string;
    designId?: string | undefined; // Load existing design
    startFresh?: boolean; // If true, ignore local cache and start new
    onSaveComplete?: (designId: string) => void;
}

// Product views configuration
const PRODUCT_VIEWS = [
    { id: 'front', label: 'Front', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80' },
    { id: 'back', label: 'Back', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80' },
    { id: 'right-sleeve', label: 'Right Sleeve', image: null },
    { id: 'left-sleeve', label: 'Left Sleeve', image: null },
    { id: 'neck-label', label: 'Neck Label', image: null },
    { id: 'outside-label', label: 'Outside Label', image: null },
];

export function DesignStudio({
    productImage,
    productName = "Untitled Product",
    designId,
    startFresh = false,
    onSaveComplete
}: DesignStudioProps) {
    // Use the integrated design studio hook
    const {
        canvas,
        setCanvas,
        activeObject,
        setActiveObject,
        currentDesign,
        isLoading,
        isSaving,

        hasUnsavedChanges,
        saveDesign,
        addText,
        addImage,
        deleteObject,
        moveObject,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useDesignStudio({ designId, startFresh });

    const [activeTool, setActiveTool] = useState("select");
    const [isMounted, setIsMounted] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [activeView, setActiveView] = useState('front');
    const [projectName, setProjectName] = useState(productName);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

    // Save handler
    const handleSave = useCallback(async () => {
        const success = await saveDesign();
        if (success && currentDesign?.id && onSaveComplete) {
            onSaveComplete(currentDesign.id);
        }
    }, [saveDesign, currentDesign?.id, onSaveComplete]);

    // Keyboard shortcut for save
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    const currentViewImage = PRODUCT_VIEWS.find(v => v.id === activeView)?.image || productImage;



    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0f] text-slate-100 overflow-hidden font-sans select-none relative">

            {/* Top Header Bar - Hide in wizard mode if desired, or keep generic */}
            <header className="h-14 bg-[#0f0f14] border-b border-[#1a1a24] flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-black text-xs">P</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24] rounded-full border border-[#27272a] hover:border-slate-600 transition-colors group">
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="bg-transparent border-none text-xs font-medium text-center text-slate-300 focus:outline-none focus:text-white w-32 group-hover:w-48 transition-all"
                        />
                        <div className="w-px h-3 bg-[#27272a]" />
                        {/* Save Status Indicator */}
                        <div className="flex items-center gap-2 text-[10px]">
                            {isSaving ? (
                                <span className="flex items-center gap-1 text-blue-400">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                </span>
                            ) : hasUnsavedChanges ? (
                                <span className="text-yellow-500" title="Unsaved changes">●</span>
                            ) : (
                                <span className="flex items-center gap-1 text-green-500" title="All changes saved">
                                    <Check className="w-3 h-3" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                        Export
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-white text-black hover:bg-slate-200 disabled:opacity-50 text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-white/5"
                    >
                        {isSaving ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Save className="w-3 h-3" />
                        )}
                        Save Design
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Left Toolbar */}
                <Toolbar
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    canvas={canvas}
                    addText={addText}
                    addImage={addImage}
                />

                {/* Center Canvas Area */}
                <main className="flex-1 relative flex flex-col overflow-hidden bg-[#0d0d12]">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <span className="text-sm text-white font-medium">Loading design...</span>
                            </div>
                        </div>
                    )}

                    {/* Canvas Container */}
                    <div className="flex-1 relative overflow-hidden">
                        {isMounted ? (
                            <Canvas
                                setCanvas={setCanvas}
                                setActiveObject={setActiveObject}
                                productImage={currentViewImage}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Initializing Studio...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Bottom Controls (Kittl Style) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">

                        {/* Island 1: View Switcher */}
                        <div className="flex items-center p-1.5 bg-[#1E1E2D] border border-[#2D2D3F] rounded-xl shadow-2xl gap-1">
                            {PRODUCT_VIEWS.filter(v => v.image !== null).map((view) => (
                                <button
                                    key={view.id}
                                    onClick={() => setActiveView(view.id)}
                                    className={`h-9 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-semibold ${activeView === view.id
                                        ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-[#2A2A3C]'
                                        }`}
                                    title={`Switch to ${view.label} view`}
                                >
                                    {view.id === 'front' ? 'Front' : view.id === 'back' ? 'Back' : view.label}
                                </button>
                            ))}
                        </div>

                        {/* Island 2: History (Undo/Redo) */}
                        <div className="flex items-center p-1.5 bg-[#1E1E2D] border border-[#2D2D3F] rounded-xl shadow-2xl gap-1">
                            <button
                                onClick={undo}
                                disabled={!canUndo}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2A2A3C] rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="w-4 h-4" />
                            </button>
                            <div className="w-px h-5 bg-[#2D2D3F]" />
                            <button
                                onClick={redo}
                                disabled={!canRedo}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2A2A3C] rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative"
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Island 3: Zoom Controls */}
                        <div className="flex items-center p-1.5 bg-[#1E1E2D] border border-[#2D2D3F] rounded-xl shadow-2xl gap-1">
                            <button
                                onClick={handleZoomOut}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2A2A3C] rounded-lg transition-all"
                                title="Zoom Out"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>

                            <div className="px-1 min-w-[3.5rem] text-center">
                                <span className="text-xs font-bold text-slate-200">{zoom}%</span>
                            </div>

                            <button
                                onClick={handleZoomIn}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2A2A3C] rounded-lg transition-all"
                                title="Zoom In"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Properties Panel */}
                <PropertiesPanel
                    canvas={canvas}
                    activeObject={activeObject}
                    moveObject={moveObject}
                    deleteObject={deleteObject}
                />
            </div>
        </div>
    );
}
