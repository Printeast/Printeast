"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ActiveFilterBadges({ basePath = "/seller" }: { basePath?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeFilters: { key: string; label: string; value: string; displayValue: string }[] = [];

    // Helper to get display name for values
    const getStatusLabel = (s: string) => {
        if (s === "PAID") return "Paid";
        if (s === "IN_PRODUCTION") return "In Production";
        if (s === "SHIPPED") return "Shipped";
        if (s === "CANCELLED") return "Cancelled";
        return s;
    };

    // Add filters based on search params
    const status = searchParams.get("status");
    if (status && status !== "all") {
        activeFilters.push({ key: "status", label: "Status", value: status, displayValue: getStatusLabel(status) });
    }

    const stores = searchParams.getAll("store");
    stores.forEach(store => {
        activeFilters.push({ key: "store", label: "Store", value: store, displayValue: store });
    });

    const country = searchParams.get("country");
    if (country && country !== "all") {
        activeFilters.push({ key: "country", label: "Country", value: country, displayValue: country });
    }

    const fulfillment = searchParams.get("fulfillment");
    if (fulfillment && fulfillment !== "all") {
        activeFilters.push({ key: "fulfillment", label: "Fulfillment", value: fulfillment, displayValue: getStatusLabel(fulfillment) });
    }

    const paymentStatus = searchParams.get("payment_status");
    if (paymentStatus && paymentStatus !== "all") {
        activeFilters.push({ key: "payment_status", label: "Payment", value: paymentStatus, displayValue: getStatusLabel(paymentStatus) });
    }

    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    if (startDate || endDate) {
        const dateValue = startDate && endDate ? `${startDate} to ${endDate}` : startDate || endDate || "";
        activeFilters.push({ key: "date", label: "Date", value: dateValue, displayValue: dateValue });
    }

    const q = searchParams.get("q");
    if (q) {
        activeFilters.push({ key: "q", label: "Search", value: q, displayValue: q });
    }

    if (activeFilters.length === 0) return null;

    const removeFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (key === "store") {
            const currentStores = params.getAll("store");
            params.delete("store");
            currentStores.filter(s => s !== value).forEach(s => params.append("store", s));
        } else if (key === "date") {
            params.delete("start_date");
            params.delete("end_date");
        } else {
            params.delete(key);
        }
        router.push(`${basePath}/orders?${params.toString()}`);
    };

    const clearAll = () => {
        router.push(`${basePath}/orders`);
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            {activeFilters.map((filter, i) => (
                <div
                    key={`${filter.key}-${filter.value}-${i}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F7FF] border border-[#D0E7FF] rounded-lg group transition-all"
                >
                    <span className="text-xs font-bold text-[#2563EB]">
                        {filter.label}: <span className="text-[#3B82F6]">{filter.displayValue}</span>
                    </span>
                    <button
                        onClick={() => removeFilter(filter.key, filter.value)}
                        className="p-0.5 rounded-full hover:bg-[#D0E7FF] text-[#3B82F6] transition-colors"
                    >
                        <X className="w-3 h-3 stroke-[3]" />
                    </button>
                </div>
            ))}
            <button
                onClick={clearAll}
                className="text-xs font-bold text-[#2563EB] hover:text-blue-700 ml-1 transition-colors"
            >
                Clear all
            </button>
        </div>
    );
}
