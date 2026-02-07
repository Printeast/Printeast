"use client";

import React, { useState } from "react";
import * as fabric from "fabric";
import {
    MousePointer2, Type, Shapes, Upload, Layers,
    Package, FileText, Grid3X3, Sparkles, ImagePlus, UserPlus,
    Search, X, ChevronRight
} from "lucide-react";

interface ToolbarProps {
    activeTool: string;
    setActiveTool: (tool: string) => void;
    canvas: fabric.Canvas | null;
    addImage: (url: string) => void;
    addText: (text: string, options?: any) => void;
}

// Sample templates
const SAMPLE_TEMPLATES = [
    { id: 1, name: 'Minimal Logo', category: 'Business' },
    { id: 2, name: 'Bold Statement', category: 'Quote' },
    { id: 3, name: 'Vintage Style', category: 'Retro' },
    { id: 4, name: 'Modern Abstract', category: 'Art' },
];

// Sample fonts
const SAMPLE_FONTS = [
    { name: 'Inter', style: 'sans-serif' },
    { name: 'Playfair Display', style: 'serif' },
    { name: 'Roboto Mono', style: 'monospace' },
    { name: 'Bebas Neue', style: 'display' },
];

// Clipart categories
const CLIPART_CATEGORIES = ['Popular', 'Animals', 'Nature', 'Symbols', 'Icons', 'Decorations'];

export function Toolbar({ activeTool, setActiveTool, canvas, addImage, addText }: ToolbarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Optional: Show local preview immediately for UX
            const reader = new FileReader();
            reader.onload = (f) => {
                const localData = f.target?.result as string;
                if (localData) addImage(localData);
            };
            reader.readAsDataURL(file);

            // TODO: In production, upload to backend and get permanent URL
            // const path = await storageService.upload(file);
            // const fullUrl = storageService.getPublicUrl(path);
            // addImage(fullUrl);
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    // Add shapes
    const handleAddShape = (type: 'rect' | 'circle' | 'triangle') => {
        if (!canvas) return;
        let shape: fabric.Object;

        switch (type) {
            case 'rect':
                shape = new fabric.Rect({
                    left: 250, top: 300, fill: "#3b82f6",
                    width: 100, height: 100, originX: 'center', originY: 'center',
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    left: 250, top: 300, fill: "#22c55e",
                    radius: 50, originX: 'center', originY: 'center',
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    left: 250, top: 300, fill: "#f59e0b",
                    width: 100, height: 100, originX: 'center', originY: 'center',
                });
                break;
        }
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.requestRenderAll();
    };

    // Close panel
    const closePanel = () => setActiveTool("select");

    // Sidebar tools configuration
    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'divider1', type: 'divider' },
        { id: 'product', icon: Package, label: 'Product' },
        { id: 'uploads', icon: Upload, label: 'Upload / Files' },
        { id: 'templates', icon: Grid3X3, label: 'Templates' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'shapes', icon: Shapes, label: 'Shapes' },
        { id: 'divider2', type: 'divider' },
        { id: 'ai', icon: Sparkles, label: 'Printeast AI' },
        { id: 'stock', icon: ImagePlus, label: 'Stock Images' },
        { id: 'hire', icon: UserPlus, label: 'Hire Designer' },
        { id: 'divider3', type: 'divider' },
        { id: 'layers', icon: Layers, label: 'Layers' },
    ];

    return (
        <>
            {/* Left Icon Bar */}
            <aside className="w-14 flex flex-col items-center py-3 bg-[#0f0f14] border-r border-[#1a1a24] z-20 shrink-0">
                {tools.map((tool) => (
                    tool.type === 'divider' ? (
                        <div key={tool.id} className="h-px w-8 bg-[#1a1a24] my-2" />
                    ) : (
                        <ToolButton
                            key={tool.id}
                            icon={tool.icon!}
                            label={tool.label!}
                            active={activeTool === tool.id}
                            onClick={() => setActiveTool(tool.id)}
                        />
                    )
                ))}
            </aside>

            {/* Secondary Panel */}
            {activeTool !== "select" && (
                <div className="w-80 bg-[#0f0f14] border-r border-[#1a1a24] flex flex-col z-10 shrink-0 animate-in slide-in-from-left-2 duration-150">
                    {/* Panel Header */}
                    <div className="h-12 border-b border-[#1a1a24] flex items-center justify-between px-4 shrink-0">
                        <h3 className="font-bold text-sm capitalize text-white">
                            {activeTool === 'ai' ? 'Printeast AI' : activeTool === 'stock' ? 'Stock Images' : activeTool}
                        </h3>
                        <button
                            onClick={closePanel}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#27272a] rounded transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto">

                        {/* PRODUCT Panel */}
                        {activeTool === "product" && (
                            <div className="p-4 space-y-4">
                                <div className="bg-[#1a1a24] rounded-xl p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-[#27272a] rounded-lg flex items-center justify-center">
                                            <Package className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">Classic T-Shirt</p>
                                            <p className="text-xs text-slate-500">Gildan 5000</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] rounded-lg text-xs font-medium text-slate-300 transition-all">
                                        Change Product
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Details</label>
                                    <div className="space-y-2">
                                        <DetailRow label="Cost" value="$8.50" />
                                        <DetailRow label="Print Area" value='12" × 16"' />
                                        <DetailRow label="Print Technique" value="DTG" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Colors Available</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['#ffffff', '#000000', '#1f2937', '#dc2626', '#2563eb', '#16a34a'].map(c => (
                                            <button
                                                key={c}
                                                className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-blue-500 transition-all"
                                                style={{ background: c, boxShadow: c === '#ffffff' ? 'inset 0 0 0 1px #27272a' : 'none' }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sizes</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                                            <button
                                                key={size}
                                                className="px-3 py-1.5 bg-[#1a1a24] hover:bg-[#27272a] rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UPLOAD Panel */}
                        {activeTool === "uploads" && (
                            <div className="p-4 space-y-4">
                                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                                    <div className="flex items-start gap-2 mb-3">
                                        <FileText className="w-4 h-4 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-blue-400">Image Requirements</p>
                                            <p className="text-[10px] text-slate-400 mt-1">PNG or JPG, min 300 DPI, transparent background recommended</p>
                                        </div>
                                    </div>
                                </div>

                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#27272a] bg-[#1a1a24]/50 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                                    <Upload className="w-10 h-10 mb-3 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                    <p className="text-sm text-slate-300 font-semibold">Click to upload</p>
                                    <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Uploads</label>
                                        <button className="text-[10px] text-blue-500 hover:text-blue-400">View All</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="aspect-square bg-[#1a1a24] rounded-lg border border-[#27272a] hover:border-blue-500 cursor-pointer transition-all" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEMPLATES Panel */}
                        {activeTool === "templates" && (
                            <div className="p-4 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 bg-[#1a1a24] border border-[#27272a] rounded-xl pl-10 pr-4 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {['All', 'My Saved', 'Printeast', 'Trending'].map((cat, i) => (
                                        <button
                                            key={cat}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'bg-[#1a1a24] text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {SAMPLE_TEMPLATES.map(template => (
                                        <div
                                            key={template.id}
                                            className="aspect-[3/4] bg-[#1a1a24] rounded-xl border border-[#27272a] hover:border-blue-500 cursor-pointer transition-all relative group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-white">{template.name}</p>
                                                    <p className="text-[10px] text-slate-400">{template.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TEXT Panel */}
                        {activeTool === "text" && (
                            <div className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <button
                                        onClick={() => addText("Heading", { fontSize: 48, fontWeight: 'bold', fill: '#000000' })}
                                        className="w-full h-14 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-xl flex items-center justify-center font-bold text-xl transition-all hover:border-blue-500"
                                    >
                                        Add Heading
                                    </button>
                                    <button
                                        onClick={() => addText("Subheading", { fontSize: 28, fontWeight: '600', fill: '#000000' })}
                                        className="w-full h-12 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-xl flex items-center justify-center font-semibold text-base transition-all hover:border-blue-500"
                                    >
                                        Add Subheading
                                    </button>
                                    <button
                                        onClick={() => addText("Body text", { fontSize: 16, fill: '#000000' })}
                                        className="w-full h-10 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-xl flex items-center justify-center text-sm transition-all hover:border-blue-500"
                                    >
                                        Add Body Text
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Font Styles</label>
                                    <div className="space-y-1.5">
                                        {SAMPLE_FONTS.map(font => (
                                            <button
                                                key={font.name}
                                                onClick={() => addText(font.name, { fontFamily: font.name, fontSize: 24, fill: '#000000' })}
                                                className="w-full h-12 bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] rounded-lg flex items-center justify-between px-4 transition-all hover:border-blue-500"
                                            >
                                                <span style={{ fontFamily: font.style }} className="text-sm">{font.name}</span>
                                                <ChevronRight className="w-4 h-4 text-slate-500" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-[#1a1a24] hover:bg-[#27272a] border border-dashed border-[#3f3f46] rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all">
                                    + Upload Custom Font
                                </button>
                            </div>
                        )}

                        {/* SHAPES Panel */}
                        {activeTool === "shapes" && (
                            <div className="p-4 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search shapes..."
                                        className="w-full h-10 bg-[#1a1a24] border border-[#27272a] rounded-xl pl-10 pr-4 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Basic Shapes</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        <ShapeButton onClick={() => handleAddShape('rect')}>
                                            <div className="w-6 h-6 bg-blue-500 rounded" />
                                        </ShapeButton>
                                        <ShapeButton onClick={() => handleAddShape('circle')}>
                                            <div className="w-6 h-6 bg-green-500 rounded-full" />
                                        </ShapeButton>
                                        <ShapeButton onClick={() => handleAddShape('triangle')}>
                                            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-500" />
                                        </ShapeButton>
                                        <ShapeButton>
                                            <div className="w-6 h-6 bg-purple-500 rounded-sm rotate-45 scale-75" />
                                        </ShapeButton>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clipart Categories</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {CLIPART_CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                className="px-3 py-1.5 bg-[#1a1a24] hover:bg-[#27272a] rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {['★', '♦', '●', '▲', '◆', '✦', '○', '□', '♥', '✿', '☀', '⚡'].map((shape, i) => (
                                        <button key={i} className="aspect-square bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] hover:border-blue-500 rounded-lg flex items-center justify-center text-xl transition-all">
                                            {shape}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI Panel */}
                        {activeTool === "ai" && (
                            <div className="p-4 space-y-4">
                                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-purple-400" />
                                        <span className="font-bold text-white text-sm">Printeast AI</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Generate unique designs using AI. Describe what you want and let AI create it for you.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Describe your design</label>
                                    <textarea
                                        placeholder="A vintage-style logo with mountains and the text 'Adventure Awaits'..."
                                        className="w-full h-24 bg-[#1a1a24] border border-[#27272a] rounded-xl p-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
                                    />
                                </div>

                                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Generate Design
                                </button>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Prompts</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Minimalist', 'Vintage', 'Abstract', 'Typography', 'Nature'].map(tag => (
                                            <button
                                                key={tag}
                                                className="px-3 py-1.5 bg-[#1a1a24] hover:bg-purple-500/20 hover:text-purple-400 border border-[#27272a] hover:border-purple-500/50 rounded-full text-xs font-medium text-slate-400 transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STOCK IMAGES Panel */}
                        {activeTool === "stock" && (
                            <div className="p-4 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search patterns, vectors..."
                                        className="w-full h-10 bg-[#1a1a24] border border-[#27272a] rounded-xl pl-10 pr-4 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {['Patterns', 'Vectors', 'Photos'].map((cat, i) => (
                                        <button
                                            key={cat}
                                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'bg-[#1a1a24] text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-[#1a1a24] rounded-xl border border-[#27272a] hover:border-blue-500 cursor-pointer transition-all"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* HIRE DESIGNER Panel */}
                        {activeTool === "hire" && (
                            <div className="p-4 space-y-4">
                                <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-xl p-4 text-center">
                                    <UserPlus className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                    <h4 className="font-bold text-white text-sm mb-1">Need Help?</h4>
                                    <p className="text-xs text-slate-400">Connect with professional designers to bring your vision to life.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">How it works</label>
                                    <div className="space-y-2">
                                        <StepItem number={1} text="Describe your design requirements" />
                                        <StepItem number={2} text="Get matched with expert designers" />
                                        <StepItem number={3} text="Review and approve designs" />
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl text-sm font-bold text-white transition-all">
                                    Find a Designer
                                </button>
                            </div>
                        )}

                        {/* LAYERS Panel */}
                        {activeTool === "layers" && (
                            <div className="p-4 space-y-4">
                                <div className="text-center py-12">
                                    <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-400">No layers yet</p>
                                    <p className="text-xs text-slate-600 mt-1">Add elements to see them here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

// Helper Components
function ToolButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 mb-0.5 rounded-lg flex items-center justify-center transition-all group relative ${active
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-slate-500 hover:text-white hover:bg-[#1a1a24]'
                }`}
            title={label}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-current'}`} strokeWidth={active ? 2 : 1.5} />
        </button>
    );
}

function ShapeButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="aspect-square bg-[#1a1a24] hover:bg-[#27272a] border border-[#27272a] hover:border-blue-500 rounded-lg flex items-center justify-center transition-all"
        >
            {children}
        </button>
    );
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[#1a1a24]">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-xs font-medium text-white">{value}</span>
        </div>
    );
}

function StepItem({ number, text }: { number: number, text: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-[#1a1a24] rounded-lg">
            <div className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-xs font-bold">
                {number}
            </div>
            <span className="text-xs text-slate-300">{text}</span>
        </div>
    );
}
