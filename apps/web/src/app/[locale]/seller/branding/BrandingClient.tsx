"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Role } from "@repo/types";

interface BrandingClientProps {
    userEmail: string;
    role?: Role;
    pageTitle?: string;
    pageDescription?: string;
}

export function BrandingClient({
    userEmail,
    role = "SELLER",
    pageTitle = "Branding and Packaging Services",
    pageDescription = "Unlock the power of unforgettable branding to resonate with your audience and elevate your business to new heights."
}: BrandingClientProps) {
    const bgSoft = "#F9F8F6";

    const services = [
        {
            title: "Packing Inserts",
            description: "Add a custom insert card to show off your brand identity and leave a meaningful personal message for your customers with every order.",
            image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
            cta: "Set up inserts",
            availability: "All stores and providers"
        },
        {
            title: "Neck Labels",
            description: "Personalize your garments with custom printed neck labels that promote your brand authority and delight your customers with premium finishing.",
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
            cta: "Explore neck labels",
            availability: "All stores and providers"
        },
        {
            title: "Gift Messages",
            description: "Create a gift message template using your logo and customized fonts to match the unique look and feel of your online store.",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            cta: "Configure messages",
            availability: "All stores and providers"
        },
        {
            title: "Branded Labels",
            description: "Enhance your brand recognition with high-quality adhesive labels, perfect for adding a professional touch to your external product packaging.",
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
            cta: "Customize labels",
            availability: "All stores and providers"
        }
    ];

    return (
        <DashboardLayout user={{ email: userEmail, role }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-10 max-w-[1400px] mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-[28px] font-bold text-slate-900 leading-tight">{pageTitle}</h1>
                            <button className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-slate-500 text-[15px]">{pageDescription}</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                            <div key={service.title} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-8 pb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-lg">{service.description}</p>

                                    <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden shadow-inner">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <div className="mt-auto px-8 pb-8 pt-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                        <span className="text-xs font-medium text-slate-500">Availability: {service.availability}</span>
                                    </div>
                                    <button className="w-full py-3 bg-[#2563eb] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                                        {service.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 border-t border-slate-200 pt-8 pb-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Need help getting started?</h4>
                            <p className="text-xs text-slate-500 mt-1">Learn how to make the most of our branding features.</p>
                        </div>
                        <div className="flex items-center gap-6 text-xs font-bold text-blue-600">
                            <Link href="#" className="hover:underline hover:text-blue-800 transition-colors">Video Tutorial</Link>
                            <Link href="#" className="hover:underline hover:text-blue-800 transition-colors">Read Article</Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
