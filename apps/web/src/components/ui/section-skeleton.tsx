"use client"

import { cn } from "@/lib/utils"

interface SectionSkeletonProps {
    height?: string
    className?: string
}

/**
 * Professional loading skeleton with shimmer effect.
 * Used for code-splitting loading states on dynamic imports.
 */
export const SectionSkeleton = ({ height = "h-[600px]", className }: SectionSkeletonProps) => (
    <div
        className={cn(
            "relative w-full overflow-hidden bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50",
            "rounded-3xl my-12 mx-auto max-w-7xl border border-slate-100/50",
            height,
            className
        )}
        role="status"
        aria-label="Loading content"
    >
        {/* Shimmer animation overlay */}
        <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
                animationTimingFunction: "ease-in-out",
            }}
        />
        <span className="sr-only">Loading...</span>
    </div>
)

// Add shimmer keyframe to global styles if not present
// @keyframes shimmer { 100% { transform: translateX(100%); } }
