"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const FOOTER_LINKS = [
    {
        title: "About",
        links: [
            { label: "Our Story", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Press", href: "#" },
            { label: "Contact", href: "#" },
        ],
    },
    {
        title: "Explore",
        links: [
            { label: "Global Network", href: "#" },
            { label: "Products", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Showcase", href: "#" },
        ],
    },
    {
        title: "Connect",
        links: [
            { label: "API Docs", href: "#" },
            { label: "Shopify App", href: "#" },
            { label: "Etsy Connect", href: "#" },
            { label: "Custom Solutions", href: "#" },
        ],
    },
    {
        title: "Start Selling",
        links: [
            { label: "Creator Studio", href: "#" },
            { label: "Merchant Portal", href: "#" },
            { label: "Sample Kits", href: "#" },
            { label: "Shipping Info", href: "#" },
        ],
    },
    {
        title: "Learn",
        links: [
            { label: "Blog", href: "#" },
            { label: "Academy", href: "#" },
            { label: "Help Center", href: "#" },
            { label: "Community", href: "#" },
        ],
    },
]

export function Footer() {
    return (
        <footer className="relative w-full bg-black text-white pt-40 pb-0 overflow-hidden z-40">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">

                {/* Top: Links Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8 mb-32">
                    {FOOTER_LINKS.map((column, colIndex) => (
                        <motion.div
                            key={column.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: colIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-6"
                        >
                            <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
                                {column.title}
                            </h4>
                            <ul className="flex flex-col gap-4">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 block w-fit hover:translate-x-1 transform"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom: Massive Logo & Legal */}
                <div className="relative border-t border-white/10 pt-10 pb-3 flex flex-col items-center">
                    {/* Legal Links (Small) */}
                    <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 mb-12 sm:mb-24 gap-4 px-4 text-center md:text-left">
                        <p>&copy; {new Date().getFullYear()} Printeast Technologies. All rights reserved.</p>
                        <div className="flex gap-6 justify-center md:justify-start">
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>

                    {/* Massive Text Logo */}
                    <div className="w-full flex justify-center overflow-hidden select-none pointer-events-none leading-none">
                        <motion.h1
                            initial={{ y: 30, opacity: 0.5 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[13.5vw] leading-[0.8] font-black tracking-tighter text-white mix-blend-overlay opacity-90 text-center"
                        >
                            PRINTEAST
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Subtle Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-900/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        </footer>
    )
}
