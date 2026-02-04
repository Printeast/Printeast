import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { RefreshCw } from "lucide-react";

export default async function SellerBrandingPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const cards = [
        {
            title: "Packing Inserts",
            body: "Add a custom insert card to show off your brand identity and leave a meaningful personal message for your customers with every order.",
            cta: "Set up inserts",
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        },
        {
            title: "Neck Labels",
            body: "Personalize your garments with custom printed neck labels that promote your brand authority and delight your customers with premium finishing.",
            cta: "Explore neck labels",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        },
        {
            title: "Gift Messages",
            body: "Create a gift message template using your logo and customized fonts to match the unique look and feel of your online store.",
            cta: "Configure messages",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        },
        {
            title: "Branded Labels",
            body: "Enhance your brand recognition with high-quality adhesive labels, perfect for adding a professional touch to your external product packaging.",
            cta: "Customize labels",
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
        },
    ];

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">Seller Branding and Packaging Services</h1>
                            <Link
                                href="/seller/branding"
                                className="h-9 w-9 rounded-lg border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                                aria-label="Refresh"
                            >
                                <RefreshCw className="h-4 w-4 dash-muted" />
                            </Link>
                        </div>
                        <p className="dash-muted mt-1">Unlock the power of unforgettable branding to resonate with your audience and elevate your business to new heights.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cards.map((card) => (
                        <div key={card.title} className="rounded-lg border dash-border dash-panel p-4 space-y-3">
                            <div className="min-h-[120px]">
                                <h3 className="text-xl font-semibold">{card.title}</h3>
                                <p className="mt-2 text-base dash-muted">{card.body}</p>
                            </div>
                            <div className="overflow-hidden rounded-lg border border-slate-200 w-full h-[420px] mx-auto">
                                <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
                                    Availability: All stores and providers
                                </span>
                            </div>
                            <button className="h-12 w-full rounded-lg bg-[#2563eb] text-base font-semibold text-white">
                                {card.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <div>
                        <p className="font-semibold text-slate-700">Need help getting started?</p>
                        <p>Learn how to make the most of our branding features.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="#" className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                            Video Tutorial
                        </Link>
                        <Link href="#" className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                            Read Article
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
