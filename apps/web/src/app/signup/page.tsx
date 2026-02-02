"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialButtons, OrDivider } from "@/components/auth/social-buttons";
import { useAuth } from "@/hooks/use-auth";

export default function SignupPage() {
    const { status, setStatus, message, setMessage, handleAuthAction, isLoading } = useAuth();
    const [view, setView] = useState<"options" | "email">("options");
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleAuthAction(
            () => AuthService.signUp(formData),
            "/onboarding"
        );
        if (result?.success && !result.session) setStatus("success");
    };

    return (
        <AuthLayout
            title={view === "options" ? "Start your journey." : "Create your account"}
            subtitle="Join thousands of creators building the future of commerce."
        >
            <AnimatePresence mode="wait">
                {view === "options" ? (
                    <motion.div key="options" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
                                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg font-poppins">P</span>
                                </div>
                                <span className="text-xl font-bold font-poppins text-slate-900 tracking-tight">Printeast</span>
                            </div>
                             <h1 className="text-3xl lg:text-[38px] font-bold text-neutral-900 tracking-tight font-poppins mb-3 text-center lg:text-left">Let&apos;s get started</h1>
                            <p className="text-[#626262] text-[15px] leading-snug text-center lg:text-left font-medium">Create an account and explore products and tools to help you sell.</p>
                        </div>

                        <SocialButtons onLoading={isLoading => setStatus(isLoading ? "loading" : "idle")} onError={setMessage} disabled={isLoading} />
                        <OrDivider />

                        <Button onClick={() => setView("email")} className="w-full h-12 bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-[15px] rounded-full transition-all shadow-lg shadow-neutral-200">
                            Sign up with your email
                        </Button>

                        <div className="mt-6 w-full text-center text-[14px] text-slate-500 font-medium">
                            Already have an account? <Link href="/login" className="text-[#0066cc] hover:underline font-bold ml-1.5 transition-colors">Sign in</Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <button onClick={() => setView("options")} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 group transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[14px] font-medium">All sign up options</span>
                        </button>

                        {status === "success" ? (
                            <div className="w-full bg-green-50 rounded-3xl p-8 border border-green-100 text-center">
                                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">Check your inbox</h3>
                                 <p className="text-slate-600 mb-6 text-sm leading-relaxed">We&apos;ve sent a magic link to <b>{formData.email}</b>. Click the link to complete signup.</p>
                                <Button variant="outline" onClick={() => setStatus("idle")} className="w-full h-11 rounded-full border-slate-300 text-slate-700 font-semibold">Try another email</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {status === "error" && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium">{message}</div>}

                                <AuthInput label="Full name" name="fullName" placeholder="Enter your first and last name" value={formData.fullName} onChange={handleChange} required />
                                <AuthInput label="Email" name="email" type="email" placeholder="Your email" value={formData.email} onChange={handleChange} required />
                                <AuthInput label="Password" name="password" type="password" placeholder="Use strong password" value={formData.password} onChange={handleChange} required minLength={8} />

                                <div className="pt-1 text-center text-[12px] leading-relaxed text-slate-600">
                                    By clicking Create account, you agree to {" "}
                                    {["Terms of Service", "Data Processing Terms", "Cookie Policy"].map((t, i) => (
                                        <span key={t}><Link href="#" className="text-[#0066cc] hover:underline font-semibold">{t}</Link>{i < 2 ? ", " : ""}</span>
                                    ))}
                                </div>

                                <Button type="submit" className="w-full h-12 bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-[15px] rounded-full mt-4 transition-all shadow-lg shadow-neutral-200" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Create account"}
                                </Button>

                                <div className="mt-6 text-center text-[14px] text-slate-500 font-medium">
                                    Already have an account? <Link href="/login" className="text-[#0066cc] hover:underline font-bold ml-1 transition-colors">Sign in</Link>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
}
