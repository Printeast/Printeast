"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-bg flex flex-col items-center justify-center relative overflow-hidden font-inter selection:bg-primary-pink selection:text-white">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-primary-pink/20 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[800px] h-[800px] bg-primary-orange/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl font-poppins">P</span>
            </div>
            <span className="text-2xl font-bold font-poppins text-text-main tracking-tight">Printeast</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-text-main tracking-tight mb-6 leading-tight">
            Create without <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange to-primary-pink">limits.</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            The world&apos;s first AI-Native Print on Demand Operating System.
            Bringing your creative vision to physical products in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-10 rounded-full bg-black text-white hover:bg-neutral-800 text-lg font-bold shadow-xl shadow-slate-200 group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-base-border text-lg font-bold hover:bg-slate-50">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                  <Image src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="User" width={40} height={40} />
                </div>
              ))}
            </div>
            <p className="text-text-secondary font-medium">Joined by 1,000+ creators</p>
          </div>
        </motion.div>
      </div>

      <footer className="absolute bottom-8 w-full text-center text-text-muted font-medium">
        © 2026 Printeast Technologies. All rights reserved.
      </footer>
    </main>
  );
}
