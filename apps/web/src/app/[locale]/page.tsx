"use client"

import dynamic from "next/dynamic"
import { ImageCarouselHero } from "@/components/landing/hero"
import { SectionSkeleton } from "@/components/ui/section-skeleton"
import { SectionErrorBoundary } from "@/components/ui/error-boundary"
import { LandingNavbar } from "@/components/landing/landing-navbar"
// ScrollReveal removed for performance optimization

// --- Dynamic Imports with SSR disabled ONLY for heavy interactive islands ---
// FeatureShowcase: Enabled SSR for immediate LCP. Reduced height to 300vh for snappier scroll.
const FeatureShowcase = dynamic(() => import("@/components/landing/feature-showcase").then(mod => mod.FeatureShowcase), {
  loading: () => <SectionSkeleton height="h-[300vh]" />
})
const CustomizableProducts = dynamic(() => import("@/components/landing/customizable-products").then(mod => mod.CustomizableProducts), {
  loading: () => <SectionSkeleton height="h-[300vh]" />
})
const ProfitCalculator = dynamic(() => import("@/components/landing/profit-calculator").then(mod => mod.ProfitCalculator), {
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const IdeasInspiration = dynamic(() => import("@/components/landing/ideas-inspiration").then(mod => mod.IdeasInspiration), {
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const Logos3 = dynamic(() => import("@/components/landing/logos3").then(mod => mod.Logos3), {
  loading: () => <SectionSkeleton height="h-[300px]" />
})
const AiStudioSection = dynamic(() => import("@/components/landing/ai-studio-section").then(mod => mod.AiStudioSection), {
  loading: () => <SectionSkeleton height="h-[1000px]" />
})
const GlobalReach = dynamic(() => import("@/components/landing/global-reach").then(mod => mod.GlobalReach), {
  ssr: false, // Keep false for heavy Webster D3/Canvas
  loading: () => <SectionSkeleton height="h-[1200px]" />
})
const Testimonials = dynamic(() => import("@/components/landing/testimonials").then(mod => mod.Testimonials), {
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const ReadyToStart = dynamic(() => import("@/components/landing/ready-to-start").then(mod => mod.ReadyToStart), {
  loading: () => <SectionSkeleton height="h-[400px]" />
})
const Footer = dynamic(() => import("@/components/landing/footer").then(mod => mod.Footer), {
  loading: () => <SectionSkeleton height="h-[400px]" />
})



export default function Home() {
  return (
    <main className="min-h-screen relative bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* GLOBAL ATMOSPHERIC SYSTEM */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#f8fafc]" />
        {/* Subtle Noise Texture for Premium Feel */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <LandingNavbar />

      {/* Page Content */}
      <div className="relative z-10 font-sans">
        <ImageCarouselHero />

        <div id="how-it-works" className="scroll-mt-24">
          <SectionErrorBoundary name="Feature Showcase">
            <FeatureShowcase />
          </SectionErrorBoundary>
        </div>

        <div id="marketplace" className="scroll-mt-24">
          <SectionErrorBoundary name="Ideas & Inspiration">
            <IdeasInspiration />
          </SectionErrorBoundary>
        </div>

        <div id="products" className="scroll-mt-24">
          <SectionErrorBoundary name="Products">
            <CustomizableProducts />
          </SectionErrorBoundary>
        </div>

        <SectionErrorBoundary name="Partners">
          <Logos3 />
        </SectionErrorBoundary>

        <div id="pricing" className="scroll-mt-24">
          <SectionErrorBoundary name="Profit Calculator">
            <ProfitCalculator />
          </SectionErrorBoundary>
        </div>

        <div id="ai-studio" className="scroll-mt-24">
          <SectionErrorBoundary name="AI Studio">
            <AiStudioSection />
          </SectionErrorBoundary>
        </div>

        <div id="solutions" className="scroll-mt-24">
          <SectionErrorBoundary name="Global Reach">
            <GlobalReach />
          </SectionErrorBoundary>
        </div>

        <div id="testimonials" className="scroll-mt-24">
          <SectionErrorBoundary name="Testimonials">
            <Testimonials />
          </SectionErrorBoundary>
        </div>

        <SectionErrorBoundary name="Call to Action">
          <ReadyToStart />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Footer">
          <Footer />
        </SectionErrorBoundary>
      </div>
    </main>
  )
}
