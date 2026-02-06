"use client"

import { useEffect } from "react"
import ReactDOM from "react-dom"

/**
 * Performance Optimizer for Critical Resources
 * 
 * This component aggressively preconnects and prefetches resources
 * that are known to be used on the landing page, reducing latency
 * for first contentful paint.
 */
export function PreconnectOptimizer() {
    useEffect(() => {
        // === PRECONNECT: Establish early connections ===

        // Supabase Storage (Critical - Hero images, AI Studio assets)
        ReactDOM.preconnect("https://gkscoxpxoiggeeoegyac.supabase.co", { crossOrigin: "anonymous" })

        // Unsplash CDN (Critical - Feature cards, testimonials, products)
        ReactDOM.preconnect("https://images.unsplash.com", { crossOrigin: "anonymous" })

        // Google Fonts (Already handled by next/font, but belt-and-suspenders)
        ReactDOM.preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" })

        // === DNS PREFETCH: Resolve DNS early for secondary resources ===

        // Wikimedia (Logo images)
        ReactDOM.prefetchDNS("https://upload.wikimedia.org")

        // Brandfetch (Partner logos)
        ReactDOM.prefetchDNS("https://cdn.brandfetch.io")

        // Icons8 & Clearbit (Critical for Storefront Integrations)
        ReactDOM.preconnect("https://img.icons8.com", { crossOrigin: "anonymous" })
        ReactDOM.preconnect("https://logo.clearbit.com", { crossOrigin: "anonymous" })

        // Asset delivery networks
        ReactDOM.prefetchDNS("https://asset.brandfetch.io")


    }, [])

    return null
}
