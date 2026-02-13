"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { LazyMotion, domMax } from "framer-motion";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.includes("/seller");

    if (isDashboard) {
        return <LazyMotion features={domMax}>{children}</LazyMotion>;
    }

    return (
        <LazyMotion features={domMax}>
            <ReactLenis
                root
                options={{
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 2,
                    infinite: false,
                }}
            >
                {children}
            </ReactLenis>
        </LazyMotion >
    );
}
