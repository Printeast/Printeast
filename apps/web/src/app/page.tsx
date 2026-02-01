"use client"

import dynamic from "next/dynamic"
import { ImageCarouselHero } from "@/components/landing/hero"
import { SectionSkeleton } from "@/components/ui/section-skeleton"
import { SectionErrorBoundary } from "@/components/ui/error-boundary"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

// --- Dynamic Imports with SSR disabled for heavy components ---
const FeatureShowcase = dynamic(() => import("@/components/landing/feature-showcase").then(mod => mod.FeatureShowcase), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const CustomizableProducts = dynamic(() => import("@/components/landing/customizable-products").then(mod => mod.CustomizableProducts), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[700px]" />
})
const ProfitCalculator = dynamic(() => import("@/components/landing/profit-calculator").then(mod => mod.ProfitCalculator), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[600px]" />
})
const IdeasInspiration = dynamic(() => import("@/components/landing/ideas-inspiration").then(mod => mod.IdeasInspiration), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const Logos3 = dynamic(() => import("@/components/landing/logos3").then(mod => mod.Logos3), {
  loading: () => <SectionSkeleton height="h-[300px]" />
})
const AiStudioSection = dynamic(() => import("@/components/landing/ai-studio-section").then(mod => mod.AiStudioSection), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const GlobalReach = dynamic(() => import("@/components/landing/global-reach").then(mod => mod.GlobalReach), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[900px]" />
})
const Testimonials = dynamic(() => import("@/components/landing/testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[600px]" />
})
const ReadyToStart = dynamic(() => import("@/components/landing/ready-to-start").then(mod => mod.ReadyToStart), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[400px]" />
})
const Footer = dynamic(() => import("@/components/landing/footer").then(mod => mod.Footer), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-slate-950 animate-pulse" />
})

export default function Home() {
  return (
    <main className="min-h-screen relative bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Systematic Atmosphere System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-0">
          {/* Layer 1: The Master Fluid Gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_10%,rgba(240,249,255,1)_25%,rgba(224,242,254,1)_45%,rgba(240,249,255,1)_70%,rgba(248,250,252,1)_85%,#ffffff_100%)]" />

          {/* Layer 2: Atmospheric Splashes (Optimized with Radial Gradients + GUI Acceleration) */}
          {/* Splash Alpha: Hero Area (Top Right) */}
          <div className="absolute top-[-100px] right-[-15%] w-[80vw] h-[1200px] bg-[radial-gradient(circle_at_center,rgba(219,234,254,0.4)_0%,transparent_70%)] transform rotate-12 mix-blend-multiply will-change-transform translate-z-0" />

          {/* Splash Beta: Showcase Transition (Middle Left) */}
          <div className="absolute top-[1000px] left-[-25%] w-[90vw] h-[1600px] bg-[radial-gradient(circle_at_center,rgba(239,246,255,0.6)_0%,transparent_70%)] transform -rotate-12 mix-blend-multiply will-change-transform translate-z-0" />

          {/* Splash Gamma: Inspiration area (Bottom Right) */}
          <div className="absolute top-[2200px] right-[-20%] w-[85vw] h-[1400px] bg-[radial-gradient(circle_at_center,rgba(219,234,254,0.3)_0%,transparent_70%)] transform rotate-45 mix-blend-multiply will-change-transform translate-z-0" />

          {/* Dynamic Highlight - Subtle Moving Grain */}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 font-sans">
        <ImageCarouselHero
          ctaText="Dashboard"
        />

        <div id="how-it-works" className="scroll-mt-24">
          <ScrollReveal mode="fade-up" delay={0.1}>
            <SectionErrorBoundary name="Feature Showcase">
              <FeatureShowcase />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <div id="marketplace" className="scroll-mt-24">
          <ScrollReveal mode="fade-up">
            <SectionErrorBoundary name="Ideas & Inspiration">
              <IdeasInspiration />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <div id="products" className="scroll-mt-24">
          <ScrollReveal mode="scale-up" duration={0.9}>
            <SectionErrorBoundary name="Products">
              <CustomizableProducts />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <ScrollReveal mode="fade-in" duration={1.2}>
          <SectionErrorBoundary name="Partners">
            <Logos3 />
          </SectionErrorBoundary>
        </ScrollReveal>

        <div id="pricing" className="scroll-mt-24">
          <ScrollReveal mode="fade-up">
            <SectionErrorBoundary name="Profit Calculator">
              <ProfitCalculator />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <div id="ai-studio" className="scroll-mt-24">
          <ScrollReveal mode="fade-up" className="relative z-20">
            <SectionErrorBoundary name="AI Studio">
              <AiStudioSection />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <div id="solutions" className="scroll-mt-24">
          <ScrollReveal mode="fade-up">
            <SectionErrorBoundary name="Global Reach">
              <GlobalReach />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <div id="testimonials" className="scroll-mt-24">
          <ScrollReveal mode="fade-up">
            <SectionErrorBoundary name="Testimonials">
              <Testimonials />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>

        <ScrollReveal mode="scale-up">
          <SectionErrorBoundary name="Call to Action">
            <ReadyToStart />
          </SectionErrorBoundary>
        </ScrollReveal>

        <SectionErrorBoundary name="Footer">
          <Footer />
        </SectionErrorBoundary>
      </div>
    </main>
  )
}
