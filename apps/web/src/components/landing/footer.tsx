"use client"

import { motion } from "framer-motion"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function Footer() {
    const t = useTranslations('Footer');

    const FOOTER_LINKS = [
        {
            title: t('columns.about'),
            links: [
                { label: t('links.ourStory'), href: "#" },
                { label: t('links.careers'), href: "#" },
                { label: t('links.press'), href: "#" },
                { label: t('links.contact'), href: "#" },
            ],
        },
        {
            title: t('columns.explore'),
            links: [
                { label: t('links.globalNetwork'), href: "#" },
                { label: t('links.products'), href: "#" },
                { label: t('links.pricing'), href: "#" },
                { label: t('links.showcase'), href: "#" },
            ],
        },
        {
            title: t('columns.connect'),
            links: [
                { label: t('links.apiDocs'), href: "#" },
                { label: t('links.shopifyApp'), href: "#" },
                { label: t('links.etsyConnect'), href: "#" },
                { label: t('links.customSolutions'), href: "#" },
            ],
        },
        {
            title: t('columns.startSelling'),
            links: [
                { label: t('links.creatorStudio'), href: "#" },
                { label: t('links.merchantPortal'), href: "#" },
                { label: t('links.sampleKits'), href: "#" },
                { label: t('links.shippingInfo'), href: "#" },
            ],
        },
        {
            title: t('columns.learn'),
            links: [
                { label: t('links.blog'), href: "#" },
                { label: t('links.academy'), href: "#" },
                { label: t('links.helpCenter'), href: "#" },
                { label: t('links.community'), href: "#" },
            ],
        },
    ]

    return (
        <footer className="relative w-full bg-black text-white pt-40 pb-0 overflow-hidden z-40">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">

                {/* Top: Links Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8 mb-32">
                    {FOOTER_LINKS.map((column, colIndex) => (
                        <motion.div
                            key={column.title}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: colIndex * 0.1 }}
                            className="flex flex-col gap-6"
                        >
                            <h4 className="text-sm font-semibold text-white/40 tracking-wider">
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
                        <p>&copy; {new Date().getFullYear()} Printeast Technologies. {t('legal.rights')}</p>
                        <div className="flex gap-6 justify-center md:justify-start">
                            <Link href="#" className="hover:text-white transition-colors">{t('legal.privacyPolicy')}</Link>
                            <Link href="#" className="hover:text-white transition-colors">{t('legal.termsOfService')}</Link>
                        </div>
                    </div>

                    {/* Massive Text Logo */}
                    <div className="w-full flex justify-center overflow-hidden select-none pointer-events-none leading-none">
                        <motion.h1
                            animate={{ y: 0, opacity: 1 }}
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
