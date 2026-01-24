"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api.service";
import { Loader2, Building2, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { getMockUser, isMockAuthEnabled, setMockUser, getRolePath, TEST_USERS } from "@/lib/mock-auth";

type Step = "role" | "details" | "complete";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("role");
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(false);

    // Check if user is already onboarded
    useEffect(() => {
        if (!isMockAuthEnabled()) {
            const checkUser = async () => {
                try {
                    const res = await api.get("/auth/me");
                    if (!res.success || !(res.data as { user?: unknown })?.user) {
                        router.push("/login");
                    }
                } catch {
                    router.push("/login");
                }
            };
            checkUser();
        } else {
            // In mock mode, stay on onboarding so the user can pick a role
            // even if a previous mock role exists.
        }
    }, [router]);

    const handleRoleSelect = (selectedRole: "CREATOR" | "SELLER") => {
        if (isMockAuthEnabled()) {
            setMockUser(selectedRole);
            router.push(getRolePath(selectedRole));
            return;
        }

        if (selectedRole === "CREATOR") {
            handleSubmit(selectedRole, "");
        } else {
            setStep("details");
        }
    };

    const handleSubmit = async (selectedRole: string, bName: string) => {
        if (isMockAuthEnabled()) {
            setMockUser(selectedRole as "CREATOR" | "SELLER");
            router.push(getRolePath(selectedRole as "CREATOR" | "SELLER"));
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/onboard", {
                role: selectedRole,
                businessName: bName || undefined,
            });

            if (res.success) {
                setStep("complete");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            }
        } catch {
            console.error("Onboarding failed");
            // Handle error state
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-base-bg p-6 font-inter">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 font-poppins mb-3">
                            {step === "role" && "How will you use Printeast?"}
                            {step === "details" && "Tell us about your business"}
                            {step === "complete" && "All set!"}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {step === "role" && "Choose the account type that fits you best."}
                            {step === "details" && "We need a few more details to set up your shop."}
                            {step === "complete" && "Redirecting you to your dashboard..."}
                        </p>
                        {isMockAuthEnabled() && (
                            <p className="mt-2 text-sm text-green-600 font-medium">Mock mode is ON. No backend required.</p>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "role" && (
                            <motion.div
                                key="role"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                            >
                                {isMockAuthEnabled() && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-slate-600">Use test accounts instantly:</p>
                                            <div className="mt-2 flex gap-2">
                                                {TEST_USERS.map((u) => (
                                                    <Button key={u.role} variant="outline" className="h-9" onClick={() => handleRoleSelect(u.role)}>
                                                        {u.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500">No signup required</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleRoleSelect("CREATOR")}
                                    className="w-full group relative flex items-center p-6 border-2 border-slate-100 rounded-2xl hover:border-black/10 hover:bg-slate-50 transition-all text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Personal / Creator</h3>
                                        <p className="text-slate-500 text-sm mt-1">I want to buy products or design for myself.</p>
                                    </div>
                                    <div className="absolute right-6 text-slate-300 group-hover:text-black transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect("SELLER")}
                                    className="w-full group relative flex items-center p-6 border-2 border-slate-100 rounded-2xl hover:border-black/10 hover:bg-slate-50 transition-all text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Business / Seller</h3>
                                        <p className="text-slate-500 text-sm mt-1">I want to sell products and manage orders.</p>
                                    </div>
                                    <div className="absolute right-6 text-slate-300 group-hover:text-black transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </button>
                            </motion.div>
                        )}

                        {step === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label className="text-slate-900 font-semibold">Business Name</Label>
                                    <Input
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Enter your company or brand name"
                                        className="h-12 bg-white border-slate-300 focus:ring-black focus:border-black text-lg"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("role")}
                                        className="h-12 px-6 rounded-full"
                                        disabled={loading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => handleSubmit("SELLER", businessName)}
                                        className="flex-1 h-12 bg-black hover:bg-neutral-800 text-white rounded-full font-bold"
                                        disabled={loading || !businessName.trim()}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Continue"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === "complete" && (
                            <motion.div
                                key="complete"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <p className="text-slate-600 font-medium">Setting up your dashboard...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
