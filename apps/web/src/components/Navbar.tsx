"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-base-border shadow-xl rounded-3xl px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-printeast-gradient rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-black tracking-tighter text-text-main">
            printeast.
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary">
          <Link href="#" className="hover:text-primary-pink transition-colors">
            Studio
          </Link>
          <Link href="#" className="hover:text-primary-pink transition-colors">
            Logistics
          </Link>
          <Link href="#" className="hover:text-primary-pink transition-colors">
            Marketplace
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-text-main hover:bg-base-bg rounded-xl transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-text-main text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary-pink/20 transition-all active:scale-95"
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
