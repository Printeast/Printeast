"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import {
    ChevronRight,
    ArrowLeft,
    Shirt,
    PenTool,
    Image as ImageIcon,
    FileText,
    DollarSign,
    ListChecks,
    ShoppingBag,
    Store,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { WizardProvider, useWizard } from "@/context/WizardContext";

const STEPS = [
    { id: "product", label: "Product", href: "/seller/wizard/product", icon: Shirt },
    { id: "design", label: "Design", href: "/seller/wizard/design", icon: PenTool },
    { id: "mockups", label: "Mockups", href: "/seller/wizard/mockups", icon: ImageIcon },
    { id: "details", label: "Details", href: "/seller/wizard/details", icon: FileText },
    { id: "prices", label: "Prices", href: "/seller/wizard/prices", icon: DollarSign },
    { id: "review", label: "Review", href: "/seller/wizard/review", icon: ListChecks },
];

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WizardProvider>
            <WizardLayoutContent>{children}</WizardLayoutContent>
        </WizardProvider>
    );
}

function WizardLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { saveAsTemplate, isSaving } = useWizard();
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

    // Use URL segments to identify the step, which handles locale prefixes automatically
    const segments = pathname?.split("/") || [];
    const foundIndex = STEPS.findIndex(step => segments.includes(step.id));

    // Fallback to 0 (Product) if no specific step is found in the URL but we are in wizard
    const currentStepIndex = foundIndex >= 0 ? foundIndex : 0;
    const nextStep = STEPS[currentStepIndex + 1];

    const handleSaveAsTemplate = async () => {
        await saveAsTemplate();
        // Redirect or Toast handled by context or here
    };

    return (
        <div className="h-screen flex flex-col bg-[#F9F8F6] overflow-hidden">
            {/* Wizard Header */}
            <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center px-6 justify-between shadow-sm shrink-0">
                {/* Left: Return */}
                <div className="flex-1">
                    <Link
                        href="/seller/inventory"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to store</span>
                    </Link>
                </div>

                {/* Center: Stepper */}
                <div className="flex items-center gap-2">
                    {STEPS.map((step, idx) => {
                        const isActive = currentStepIndex === idx;
                        const isCompleted = currentStepIndex > idx;

                        return (
                            <React.Fragment key={step.id}>
                                <Link
                                    href={step.href}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : isCompleted
                                            ? "text-blue-600 hover:bg-blue-50"
                                            : "text-slate-300 hover:text-slate-500"
                                        }`}
                                    title={step.label}
                                >
                                    <step.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-current"}`} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <span className="text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-2 duration-300">
                                            {step.label}
                                        </span>
                                    )}
                                </Link>
                                {idx < STEPS.length - 1 && (
                                    <ChevronRight className={`w-3 h-3 mx-1 ${isCompleted ? "text-blue-200" : "text-slate-200"}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Right: Actions */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    <span className="text-xs text-slate-400 font-medium hidden md:block">
                        {isSaving ? "Saving..." : "Progress saved in Drafts."}
                    </span>

                    {currentStepIndex === STEPS.length - 1 ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSaveAsTemplate}
                                disabled={isSaving}
                                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save as template"}
                            </button>
                            <button
                                onClick={() => setIsStoreModalOpen(true)}
                                className="px-5 py-2 bg-[#1a1a24] hover:bg-[#27272a] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-slate-200 hover:shadow-xl flex items-center gap-2"
                            >
                                Publish
                            </button>
                        </div>
                    ) : (
                        nextStep && (
                            <Link
                                href={nextStep.href}
                                className="px-5 py-2 bg-[#1a1a24] hover:bg-[#27272a] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-slate-200 hover:shadow-xl flex items-center gap-2"
                            >
                                Continue to {nextStep.label}
                            </Link>
                        )
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col overflow-y-auto overflow-x-hidden">
                {children}
            </main>

            {/* Connect Store Modal */}
            {isStoreModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-8 pb-6 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Connect with your store</h2>
                            <p className="text-slate-500 text-sm mt-1">Select a platform to publish this product.</p>
                        </div>

                        <div className="p-8 space-y-4">
                            <StoreOption
                                name="Shopify"
                                description="Sync products, inventory, and orders automatically."
                                color="bg-[#95BF47]/10 border-[#95BF47]/20 text-[#5E8E3E]"
                                icon={<ShoppingBag className="w-6 h-6" />}
                            />
                            <StoreOption
                                name="Etsy"
                                description="Reach millions of buyers on the global marketplace."
                                color="bg-[#F1641E]/10 border-[#F1641E]/20 text-[#F1641E]"
                                icon={<Store className="w-6 h-6" />}
                            />

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Don't have a store yet?</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        You can still save this product as a draft or template and publish it later once you've set up your sales channel.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsStoreModalOpen(false)}
                                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StoreOption({ name, description, color, icon }: { name: string; description: string; color: string; icon: React.ReactNode }) {
    const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");

    // Simulate connection
    const handleConnect = () => {
        setStatus("connecting");
        setTimeout(() => setStatus("connected"), 1500);
    };

    return (
        <div className={`group relative p-5 rounded-2xl border transition-all ${status === 'connected' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">{name}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">{description}</p>
                    </div>
                </div>

                <button
                    onClick={handleConnect}
                    disabled={status !== 'idle'}
                    className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${status === 'connected'
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : status === 'connecting'
                            ? 'bg-slate-100 text-slate-400 cursor-wait'
                            : 'bg-[#1a1a24] text-white hover:bg-slate-800 shadow-sm'
                        }`}
                >
                    {status === 'idle' && "Connect"}
                    {status === 'connecting' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {status === 'connected' && (
                        <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Connected
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
