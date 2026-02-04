"use client"

import { useMemo } from "react";

interface LineChartProps {
    data: { label: string; value: number }[];
    ariaLabel?: string;
    className?: string;
}

export function LineChart({ data, ariaLabel, className }: LineChartProps) {
    const max = Math.max(...data.map(d => d.value));
    const normalizedData = useMemo(() => {
        if (max === 0) return data.map(d => ({ ...d, height: 0 }));
        return data.map(d => ({ ...d, height: (d.value / max) * 100 }));
    }, [data, max]);

    return (
        <div className={`w-full h-[200px] flex items-end justify-between gap-2 pt-6 ${className || ''}`} aria-label={ariaLabel}>
            {normalizedData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full h-[150px] bg-slate-50 rounded-t-sm flex items-end overflow-hidden group-hover:bg-slate-100 transition-colors">
                        <div
                            className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 ease-out"
                            style={{ height: `${d.height}%` }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                {d.value} orders
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{d.label}</span>
                </div>
            ))}
        </div>
    )
}
