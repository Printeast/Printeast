"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-bg font-sans selection:bg-primary-pink selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="mb-4 text-6xl font-black text-text-main md:text-8xl">
          Printeast
        </h1>
        <p className="text-xl font-medium text-text-secondary">
          development in progress
        </p>
      </motion.div>
    </main>
  );
}
