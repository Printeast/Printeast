"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api.service";
import { Loader2, Building2, User, ArrowRight, CheckCircle2 } from "lucide-react";

type Step = "role" | "details" | "complete";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("role");
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(false);

    // Check if user is already onboarded
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get("/auth/me");
                if (res.success && (res.data as any)?.user) {
                    // User exists, stay here
                }
            } catch (error) {
                // If not auth, redirect to login
                router.push("/login");
            }
        };
        checkUser();
    }, [router]);

    const handleRoleSelect = (selectedRole: "CREATOR" | "SELLER") => {
        if (selectedRole === "CREATOR") {
            // If customer, maybe we don't need extra details?
            // Let's go to complete/submit immediately
            // setStep("complete");
            handleSubmit(selectedRole, "");
        } else {
            setStep("details");
        }
    };

    const handleSubmit = async (selectedRole: string, bName: string) => {
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
        } catch (error) {
            console.error("Onboarding failed", error);
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
