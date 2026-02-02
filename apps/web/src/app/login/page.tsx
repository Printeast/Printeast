"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialButtons, OrDivider } from "@/components/auth/social-buttons";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { isMockAuthEnabled } from "@/lib/mock-auth";

export default function LoginPage() {
    const { status, setStatus, message, setMessage, handleAuthAction, isLoading } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleAuthAction(() => AuthService.signIn(formData), "/dashboard");
    };

    return (
        <AuthLayout title="Create without limits." subtitle="The world's first AI-Native Print on Demand Operating System.">
            <div className="mb-6 w-full">
                <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg font-poppins">P</span>
                    </div>
                    <span className="text-xl font-bold font-poppins text-slate-900 tracking-tight">Printeast</span>
                </div>
                <h1 className="text-3xl lg:text-[36px] font-bold text-neutral-900 tracking-tight font-poppins mb-2 text-center lg:text-left">Welcome back</h1>
            </div>

            <SocialButtons onLoading={isLoading => setStatus(isLoading ? "loading" : "idle")} onError={setMessage} disabled={isLoading} />
            <OrDivider />

            {status === "success" ? (
                <div className="w-full bg-green-50 rounded-3xl p-6 border border-green-100 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1 font-poppins">Welcome back!</h3>
                    <p className="text-slate-600 mb-1 text-xs">Redirecting you to your dashboard...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {status === "error" && <div className="p-3 text-[13px] text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium">{message}</div>}

                    {isMockAuthEnabled() && (
                        <div className="p-3 text-[13px] text-green-700 bg-green-50 rounded-xl border border-green-100 font-medium">
                            Mock mode is enabled. Use onboarding to pick a test account.
                        </div>
                    )}

                    <AuthInput label="Email" name="email" type="email" placeholder="Your email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
                    <AuthInput label="Password" name="password" type="password" placeholder="Your password" value={formData.password} onChange={handleChange} required disabled={isLoading} />

                    <div className="flex items-center justify-between text-[13px] pt-1 px-1">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" id="remember" className="w-[16px] h-[16px] rounded-[4px] border-slate-300 text-neutral-900 focus:ring-neutral-900/10 cursor-pointer" />
                            <label htmlFor="remember" className="text-slate-600 font-medium cursor-pointer group-hover:text-slate-900">Remember me</label>
                        </div>
                        <Link href="/auth/forgot-password" title="Forgot Password" className="font-semibold text-neutral-900 hover:underline underline-offset-4">Forgot Password?</Link>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-[15px] rounded-full mt-2 transition-all shadow-lg shadow-neutral-200" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Sign in"}
                    </Button>
                </form>
            )}

            <div className="mt-8 w-full text-center text-[14px] text-slate-500 font-medium">
                Don&apos;t have an account? <Link href="/signup" className="text-[#0066cc] hover:underline font-bold ml-1.5 transition-colors">Sign up</Link>
            </div>
        </AuthLayout>
    );
}
