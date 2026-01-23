"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/Button";
import { Card, CardHeader, CardContent } from "@repo/ui/Card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-bg font-sans">
      {/* Hero Section */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <h1 className="mb-6 text-6xl font-black text-text-main md:text-8xl bg-printeast-gradient bg-clip-text text-transparent">
            Printeast
          </h1>
          <p className="mb-8 text-2xl font-medium text-text-secondary">
            The AI-Native Print-on-Demand Operating System
          </p>
          <p className="mb-12 text-lg text-text-muted max-w-2xl mx-auto">
            Transform your creative vision into physical products with our vertically integrated commerce engine. 
            From design to delivery, powered by AI.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">View Dashboard</Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-12"
        >
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">AI-Powered Design</h3>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Magic-prompt generation converts creative intent into high-fidelity design assets instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">Smart Logistics</h3>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Intelligent routing optimizes for margin, speed, and reliability across our global vendor network.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">Vertical Integration</h3>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Direct control from canvas to wallet - design, production, fulfillment, and settlement.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-text-muted">
            Built with Next.js 16, React 19, Tailwind CSS, and Express
          </p>
        </motion.div>
      </div>
    </main>
  );
}
