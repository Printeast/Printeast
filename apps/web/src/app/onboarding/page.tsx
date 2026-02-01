"use client";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] text-slate-900 font-inter">
            {/* Background Texture/Gradient (Optional) */}
            <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

            <OnboardingWizard />
        </div>
    );
}
