"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api.service";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const checkRoleAndRedirect = async () => {
            const res = await api.get("/auth/me");

            if (res.success && res.data) {
                const { user } = res.data as any;
                const roleName = user.roles?.[0]?.role?.name || "CUSTOMER";

                // Map roles to their specific dashboard paths
                const rolePathMap: Record<string, string> = {
                    "ADMIN": "tenant-admin",
                    "TENANT_ADMIN": "tenant-admin",
                    "SELLER": "seller",
                    "CREATOR": "creator",
                    "CUSTOMER": "customer",
                    "VENDOR": "vendor",
                    "AFFILIATE": "affiliate",
                    "BUSINESS": "seller" // Business maps to seller
                };

                const rolePath = rolePathMap[roleName] || roleName.toLowerCase().replace("_", "-");
                router.push(`/${rolePath}`);
            } else {
                console.error("Dashboard check failed:", res.message);
                router.push("/login");
            }
        };

        checkRoleAndRedirect();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0a0a10] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
                <p className="text-white/60 font-medium">Entering your workspace...</p>
            </div>
        </div>
    );
}
