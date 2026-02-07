"use client";

import React from "react";
import * as fabric from "fabric";
import {
    MousePointer2, Trash2, ChevronUp, ChevronDown,
    AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter,
    Copy, Download, Save, ShoppingCart, Eye, Share2
} from "lucide-react";

interface PropertiesPanelProps {
    canvas: fabric.Canvas | null;
    activeObject: fabric.Object | null;
    moveObject: (dir: "up" | "down" | "top" | "bottom") => void;
    deleteObject: () => void;
}

export function PropertiesPanel({ canvas, activeObject, moveObject, deleteObject }: PropertiesPanelProps) {

    const updateProperty = (key: string, value: any) => {
        if (!activeObject || !canvas) return;
        activeObject.set(key, value);
        canvas.requestRenderAll();
    };

    const handleCenter = (type: "h" | "v" | "both") => {
        if (!activeObject || !canvas) return;
        if (type === "h") canvas.centerObjectH(activeObject);
        if (type === "v") canvas.centerObjectV(activeObject);
        if (type === "both") canvas.centerObject(activeObject);
        canvas.requestRenderAll();
    };

    const handleDuplicate = () => {
        if (!activeObject || !canvas) return;
        activeObject.clone().then((cloned: fabric.Object) => {
            cloned.set({
                left: (activeObject.left || 0) + 20,
                top: (activeObject.top || 0) + 20,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
        });
    };

    // Empty state - show project actions
    if (!activeObject) {
        return (
            <aside className="w-72 bg-[#0f0f14] border-l border-[#1a1a24] flex flex-col z-20 shrink-0">
                {/* Header */}
                <div className="h-12 border-b border-[#1a1a24] flex items-center px-4 shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Properties</span>
                </div>

                {/* Actions Section */}
                <div className="p-4 space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Actions</label>

                    <ActionButton icon={Save} label="Save as Template" variant="default" />
                    <ActionButton icon={ShoppingCart} label="Add to Orders" variant="primary" />
                    <ActionButton icon={Eye} label="Preview on Product" variant="default" />
                    <ActionButton icon={Download} label="Download Design" variant="default" />
                    <ActionButton icon={Share2} label="Share" variant="default" />
                </div>

                {/* Project Colors */}
                <div className="p-4 border-t border-[#1a1a24] space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Colors</label>
                    <div className="flex items-center gap-2 p-3 bg-[#1a1a24] rounded-lg">
                        <div className="w-6 h-6 bg-white rounded border border-slate-600" />
                        <span className="text-xs font-mono text-slate-400">#FFFFFF</span>
                        <span className="text-xs text-slate-600 ml-auto">100%</span>
                    </div>
                    <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all">
                        Browse Color Palettes
                    </button>
                </div>

                {/* Empty State Hint */}
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 px-6 pb-8">
                    <MousePointer2 className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-xs text-center text-slate-600">Select an element on the canvas to edit its properties</p>
                </div>
            </aside>
        );
    }

    const type = activeObject.type;

    return (
        <aside className="w-72 bg-[#0f0f14] border-l border-[#1a1a24] flex flex-col z-20 shrink-0">
            {/* Header */}
            <div className="h-12 border-b border-[#1a1a24] flex items-center justify-between px-4 shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Properties</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{type}</span>
            </div>

            <div className="flex-1 p-4 space-y-5 overflow-y-auto">

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={handleDuplicate}
                        className="flex-1 h-9 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-lg flex items-center justify-center gap-1.5 text-slate-400 hover:text-white transition-all text-xs font-medium"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Duplicate
                    </button>
                    <button
                        onClick={deleteObject}
                        className="h-9 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Position & Size */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                        <PropertyInput label="X" value={Math.round(activeObject.left || 0)} suffix="px" />
                        <PropertyInput label="Y" value={Math.round(activeObject.top || 0)} suffix="px" />
                    </div>
                </div>

                {/* Alignment */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alignment</label>
                    <div className="grid grid-cols-3 gap-1.5">
                        <button
                            onClick={() => handleCenter("h")}
                            className="h-9 bg-[#1a1a24] border border-[#27272a] rounded-lg hover:bg-[#27272a] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                            title="Center Horizontally"
                        >
                            <AlignHorizontalJustifyCenter className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleCenter("v")}
                            className="h-9 bg-[#1a1a24] border border-[#27272a] rounded-lg hover:bg-[#27272a] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                            title="Center Vertically"
                        >
                            <AlignVerticalJustifyCenter className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleCenter("both")}
                            className="h-9 bg-[#1a1a24] border border-[#27272a] rounded-lg hover:bg-[#27272a] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs font-medium"
                            title="Center Both"
                        >
                            Center
                        </button>
                    </div>
                </div>

                {/* Layer Order */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Layer Order</label>
                    <div className="grid grid-cols-2 gap-1.5">
                        <button
                            onClick={() => moveObject("up")}
                            className="h-9 bg-[#1a1a24] border border-[#27272a] rounded-lg hover:bg-[#27272a] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center gap-1.5 text-xs font-medium transition-all"
                        >
                            <ChevronUp className="w-4 h-4" />
                            Forward
                        </button>
                        <button
                            onClick={() => moveObject("down")}
                            className="h-9 bg-[#1a1a24] border border-[#27272a] rounded-lg hover:bg-[#27272a] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center gap-1.5 text-xs font-medium transition-all"
                        >
                            <ChevronDown className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                </div>

                {/* Opacity */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opacity</label>
                        <span className="text-xs font-mono text-slate-400">{Math.round((activeObject.opacity || 1) * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        defaultValue={activeObject.opacity}
                        onChange={(e) => updateProperty("opacity", parseFloat(e.target.value))}
                        className="w-full h-2 bg-[#1a1a24] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Text-specific controls */}
                {type === "i-text" && (
                    <>
                        {/* Font Size */}
                        <div className="space-y-2 pt-4 border-t border-[#1a1a24]">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Font Size</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="8" max="120" step="1"
                                    defaultValue={(activeObject as any).fontSize || 24}
                                    onChange={(e) => updateProperty("fontSize", parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-[#1a1a24] rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <span className="text-xs font-mono text-slate-400 w-8 text-center">{(activeObject as any).fontSize || 24}</span>
                            </div>
                        </div>

                        {/* Text Color */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Text Color</label>
                            <div className="grid grid-cols-6 gap-2">
                                {['#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'].map(c => (
                                    <button
                                        key={c}
                                        className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all hover:scale-110"
                                        style={{
                                            background: c,
                                            boxShadow: c === '#ffffff' ? 'inset 0 0 0 1px #27272a' : 'none'
                                        }}
                                        onClick={() => updateProperty("fill", c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Image-specific controls */}
                {type === "image" && (
                    <div className="space-y-2 pt-4 border-t border-[#1a1a24]">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Image Options</label>
                        <button className="w-full py-2.5 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all">
                            Replace Image
                        </button>
                        <button className="w-full py-2.5 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all">
                            Remove Background
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}

// Helper Components
function ActionButton({ icon: Icon, label, variant = 'default' }: { icon: any, label: string, variant?: 'default' | 'primary' }) {
    const isPrimary = variant === 'primary';
    return (
        <button className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${isPrimary
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] text-slate-400 hover:text-white'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

function PropertyInput({ label, value, suffix }: { label: string, value: number, suffix?: string }) {
    return (
        <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#27272a] rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold text-slate-500">{label}</span>
            <input
                type="number"
                defaultValue={value}
                className="flex-1 bg-transparent text-xs font-mono text-white text-right focus:outline-none w-12"
            />
            {suffix && <span className="text-[10px] text-slate-500">{suffix}</span>}
        </div>
    );
}
