"use client"

import { ReactLenis } from "lenis/react"
import { ReactNode } from "react"
import { LazyMotion, domMax } from "framer-motion"

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    return (
        <LazyMotion features={domMax}>
            <ReactLenis
                root
                options={{
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 1, // Reduced from 1.1 for more stable scroll
                    touchMultiplier: 2,
                    infinite: false,
                }}
            >
                {children}
            </ReactLenis>
        </LazyMotion >
    )
}
