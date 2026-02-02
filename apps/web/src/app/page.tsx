"use client"

import dynamic from "next/dynamic"
import { ImageCarouselHero } from "@/components/landing/hero"
import { SectionSkeleton } from "@/components/ui/section-skeleton"
import { SectionErrorBoundary } from "@/components/ui/error-boundary"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

// --- Dynamic Imports with SSR disabled for heavy components ---
const FeatureShowcase = dynamic(() => import("@/components/landing/feature-showcase").then(mod => mod.FeatureShowcase), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[400vh]" /> // Matched to scroll container height
})
const CustomizableProducts = dynamic(() => import("@/components/landing/customizable-products").then(mod => mod.CustomizableProducts), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[400vh]" /> // Matched to scroll container height
})
const ProfitCalculator = dynamic(() => import("@/components/landing/profit-calculator").then(mod => mod.ProfitCalculator), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[800px]" />
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
  loading: () => <SectionSkeleton height="h-[1000px]" />
})
const GlobalReach = dynamic(() => import("@/components/landing/global-reach").then(mod => mod.GlobalReach), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[1200px]" />
})
const Testimonials = dynamic(() => import("@/components/landing/testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[800px]" />
})
const ReadyToStart = dynamic(() => import("@/components/landing/ready-to-start").then(mod => mod.ReadyToStart), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[400px]" />
})
const Footer = dynamic(() => import("@/components/landing/footer").then(mod => mod.Footer), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[400px]" />
})

export default function Home() {
  return (
    <main className="min-h-screen relative bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* GLOBAL FLOW BACKGROUND SYSTEM */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50">
        {/* Base Gradient - Subtle vertical flow */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-slate-50 to-blue-50/40 z-0" />

        {/* Dynamic Flowing Blobs - Distributed for smooth transitions */}
        <div className="absolute inset-0 z-0 transform-gpu">
          {/* 1. Hero / Top Area */}
          <div className="absolute top-[-5%] right-[-10%] w-[60vw] h-[60vw] min-w-[700px] bg-blue-300/20 rounded-full blur-[100px]" />
          <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] min-w-[500px] bg-indigo-300/20 rounded-full blur-[100px]" />

          {/* Connector Stream 1 */}
          <div className="absolute top-[15%] left-[20%] w-[60vw] h-[30vw] bg-sky-200/20 rounded-full blur-[100px] transform -rotate-12" />

          {/* 2. Features / Showcase Area (~25%) */}
          <div className="absolute top-[25%] right-[-15%] w-[70vw] h-[70vw] bg-blue-400/10 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-200/20 rounded-full blur-[100px]" />

          {/* 3. Middle / Studio Area (~50%) */}
          <div className="absolute top-[45%] left-[-20%] w-[90vw] h-[60vw] bg-indigo-300/15 rounded-full blur-[120px]" />
          <div className="absolute top-[50%] right-[-10%] w-[60vw] h-[80vw] bg-blue-300/20 rounded-full blur-[100px]" />

          {/* Connector Stream 2 */}
          <div className="absolute top-[65%] left-[10%] w-[80vw] h-[40vw] bg-sky-200/20 rounded-full blur-[100px] transform rotate-12" />

          {/* 4. Bottom / Testimonials Area (~80%) */}
          <div className="absolute top-[75%] right-[0%] w-[70vw] h-[60vw] bg-blue-400/10 rounded-full blur-[120px] opacity-90" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-indigo-200/20 rounded-full blur-[100px]" />
        </div>

        {/* Grain Texture for Premium Feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0" />
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
