import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: "neutral" | "warning" | "positive" | "info";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
    const toneClass =
        tone === "warning"
            ? "bg-amber-500/20 border-amber-500/40 text-amber-100"
            : tone === "positive"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-100"
                : tone === "info"
                    ? "bg-sky-500/15 border-sky-500/30 text-sky-100"
                    : "bg-white/10 border-white/15 text-slate-100";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold",
                toneClass,
                className,
            )}
            {...props}
        />
    );
}
