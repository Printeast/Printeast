"use client"

import { m, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    mode?: "fade-up" | "fade-in" | "scale-up" | "blur-in"
    delay?: number
    duration?: number
    viewportAmount?: number
}

export function ScrollReveal({
    children,
    className,
    mode = "fade-up",
    delay = 0,
    duration = 0.6,
    viewportAmount = 0.2
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: viewportAmount, margin: "0px 0px -100px 0px" })

    const variants = {
        "fade-up": {
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 }
        },
        "fade-in": {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.9, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0 }
        },
        "blur-in": {
            hidden: { opacity: 0, filter: "blur(10px)", scale: 0.95 },
            visible: { opacity: 1, filter: "blur(0px)", scale: 1 }
        }
    }

    return (
        <m.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants[mode]}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Smooth custom cubic bezier
            }}
            className={cn(className)}
        >
            {children}
        </m.div>
    )
}
