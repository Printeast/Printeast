"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
    return <TooltipPrimitive.Provider delayDuration={100}>{children}</TooltipPrimitive.Provider>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
    return <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>;
}

export function TooltipTrigger({ children, className, ...props }: TooltipPrimitive.TooltipTriggerProps) {
    return (
        <TooltipPrimitive.Trigger className={cn("outline-none", className)} {...props}>
            {children}
        </TooltipPrimitive.Trigger>
    );
}

export function TooltipContent({ children, className, side = "right", ...props }: TooltipPrimitive.TooltipContentProps) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                side={side}
                sideOffset={8}
                className={cn(
                    "z-50 rounded-lg border dash-border bg-[var(--dash-panel-strong)] px-3 py-1.5 text-xs text-[color:var(--dash-text)] shadow-lg backdrop-blur",
                    "animate-in fade-in zoom-in-95",
                    className,
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="fill-[var(--dash-panel-strong)]" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}
