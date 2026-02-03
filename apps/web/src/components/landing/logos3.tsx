"use client";

import ScrollVelocity from "@/components/ui/scroll-velocity";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Logo {
    id: string;
    description: string;
    category: string;
    image: string;
    className?: string;
}

interface Logos3Props {
    logos?: Logo[];
    className?: string;
}

const Logos3 = ({
    logos = [
        {
            id: "shopify",
            description: "Shopify",
            category: "Platform",
            image: "https://cdn.simpleicons.org/shopify/96bf48",
            className: "h-8 w-auto",
        },
        {
            id: "etsy",
            description: "Etsy",
            category: "Marketplace",
            image: "https://cdn.simpleicons.org/etsy/F1641E",
            className: "h-8 w-auto",
        },
        {
            id: "woocommerce",
            description: "WooCommerce",
            category: "Open source platform",
            image: "https://cdn.simpleicons.org/woocommerce/96588a",
            className: "h-6 w-auto",
        },
        {
            id: "wix",
            description: "Wix",
            category: "Platform",
            image: "https://cdn.simpleicons.org/wix/000000",
            className: "h-6 w-auto",
        },
        {
            id: "squarespace",
            description: "Squarespace",
            category: "Platform",
            image: "https://cdn.simpleicons.org/squarespace/000000",
            className: "h-8 w-auto",
        },
        {
            id: "ecwid",
            description: "Ecwid",
            category: "Platform",
            image: "https://cdn.brandfetch.io/ecwid.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "bigcommerce",
            description: "BigCommerce",
            category: "Platform",
            image: "https://cdn.simpleicons.org/bigcommerce/121118",
            className: "h-8 w-auto",
        },
        {
            id: "prestashop",
            description: "Prestashop",
            category: "Open source platform",
            image: "https://cdn.simpleicons.org/prestashop/DF0067",
            className: "h-8 w-auto",
        },
        {
            id: "weebly",
            description: "Weebly",
            category: "Platform",
            image: "https://cdn.brandfetch.io/weebly.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "amazon",
            description: "Amazon",
            category: "Marketplace",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            className: "h-6 w-auto",
        },
        {
            id: "ebay",
            description: "eBay",
            category: "Marketplace",
            image: "https://cdn.simpleicons.org/ebay/E53238",
            className: "h-8 w-auto",
        },
        {
            id: "bigcartel",
            description: "Big Cartel",
            category: "Platform",
            image: "https://cdn.simpleicons.org/bigcartel/333333",
            className: "h-8 w-auto",
        },
        {
            id: "wish",
            description: "Wish",
            category: "Marketplace",
            image: "https://cdn.simpleicons.org/wish/2fb7ec",
            className: "h-8 w-auto",
        },
        {
            id: "magento",
            description: "Magento",
            category: "Open source platform",
            image: "https://cdn.brandfetch.io/magento.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "storenvy",
            description: "Storenvy",
            category: "Marketplace",
            image: "https://cdn.brandfetch.io/storenvy.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "gumroad",
            description: "Gumroad",
            category: "Platform",
            image: "https://cdn.simpleicons.org/gumroad/000000",
            className: "h-8 w-auto",
        },
        {
            id: "shipstation",
            description: "ShipStation",
            category: "Platform",
            image: "https://cdn.brandfetch.io/shipstation.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "bonanza",
            description: "Bonanza",
            category: "Marketplace",
            image: "https://cdn.brandfetch.io/bonanza.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "3dcart",
            description: "3dcart",
            category: "Platform",
            image: "https://cdn.brandfetch.io/shift4shop.com/logo",
            className: "h-8 w-auto",
        },
        {
            id: "launchcart",
            description: "Launch Cart",
            category: "Platform",
            image: "https://cdn.brandfetch.io/launchcart.com/logo",
            className: "h-6 w-auto",
        },
        {
            id: "printful",
            description: "Printful API",
            category: "Open source platform",
            image: "https://cdn.brandfetch.io/printful.com/logo",
            className: "h-8 w-auto",
        },
    ],
}: Logos3Props) => {
    const t = useTranslations('Logos');

    return (
        <section className="py-32 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-16 mb-16">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-6">
                    {t.rich('title', {
                        blue: (chunks) => <span className="text-blue-600">{chunks}</span>
                    })}
                </h2>
                <p className="text-sm md:text-base text-slate-500 max-w-2xl font-medium leading-relaxed mt-4">
                    {t('subtitle')}
                </p>
            </div>

            <div className="relative z-10 w-full">
                {/* Replaced Carousel with ScrollVelocity for velocity-based scrolling */}
                <ScrollVelocity
                    velocity={40} // Increased base speed slightly more
                    numCopies={5}
                    velocityMapping={{ input: [0, 1000], output: [0, 10] }} // Increased scroll sensitivity
                    className="flex items-center"
                >
                    <div className="flex gap-24 px-12">
                        {logos.map((logo) => (
                            <div
                                key={logo.id}
                                className="
                                    w-fit min-w-[180px] h-auto
                                    transition-all duration-500
                                    flex flex-row items-center justify-start gap-6 p-2
                                    group cursor-default flex-shrink-0 will-change-transform
                                    hover:-translate-y-1
                                ">
                                <div className="relative h-24 w-24 flex-shrink-0 flex items-center justify-center filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                    <Image
                                        src={logo.image}
                                        alt={logo.description}
                                        fill
                                        className="object-contain"
                                        sizes="96px"
                                        unoptimized // Many logos are SVGs from simpleicons/brandfetch
                                    />
                                </div>
                                <div className="text-left flex flex-col items-start min-w-0">
                                    <span className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors truncate w-full">
                                        {logo.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollVelocity>

                {/* Gradient Edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none"></div>
            </div>
        </section>
    );
};

export { Logos3 };
