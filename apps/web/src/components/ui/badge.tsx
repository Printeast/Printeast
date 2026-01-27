import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: "neutral" | "warning" | "positive" | "info";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
    const toneClass =
        tone === "warning"
            ? "bg-amber-500/15 border-amber-500/40 text-[color:var(--dash-text)]"
            : tone === "positive"
                ? "bg-emerald-500/12 border-emerald-500/30 text-[color:var(--dash-text)]"
                : tone === "info"
                    ? "bg-sky-500/12 border-sky-500/30 text-[color:var(--dash-text)]"
                    : "dash-panel-strong dash-border text-[color:var(--dash-text)]";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                toneClass,
                className,
            )}
            {...props}
        />
    );
}
