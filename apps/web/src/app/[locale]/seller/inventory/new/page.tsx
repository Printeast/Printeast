
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { Search, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Hardcoded "Blanks" for now. 
 * specific action: The user will select one of these to start the design process.
 */
const catalogItems = [
    {
        id: "cat_1",
        name: "Premium Cotton T-Shirt",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        price: 12.50,
        colors: ["#000000", "#FFFFFF", "#1E3A8A", "#DC2626"],
        category: "Men's Clothing"
    },
    {
        id: "cat_2",
        name: "Classic Hoodie",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        price: 24.00,
        colors: ["#000000", "#FFFFFF", "#4B5563"],
        category: "Men's Clothing"
    },
    {
        id: "cat_3",
        name: "Ceramic Mug 11oz",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
        price: 8.50,
        colors: ["#FFFFFF"],
        category: "Mugs & Drinkware"
    },
    {
        id: "cat_4",
        name: "Canvas Tote Bag",
        image: "https://images.unsplash.com/photo-1597484662317-c93138815143?auto=format&fit=crop&w=800&q=80",
        price: 10.00,
        colors: ["#FAF5EF", "#000000"],
        category: "Accessories"
    },
    {
        id: "cat_5",
        name: "Unisex Tank Top",
        image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&q=80",
        price: 11.00,
        colors: ["#000000", "#FFFFFF", "#EF4444"],
        category: "Men's Clothing"
    },
    {
        id: "cat_6",
        name: "Matte Poster (18x24)",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
        price: 15.00,
        colors: [],
        category: "Wall Art"
    }
];

export default async function NewProductPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-8">
                    {/* Breadcrumb / Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Link href="/seller/inventory" className="hover:text-blue-600 transition-colors">Inventory</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-semibold text-slate-900">New Product</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Select a product to start</h1>
                        <p className="text-sm text-slate-500 mt-1">Choose a blank from our catalog to customize with your design.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search blanks (e.g. 'Cotton', 'Mug', 'Poster')..."
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {catalogItems.map((item) => (
                            <Link
                                href={`/seller/design/new?catalogId=${item.id}`} // Takes them to the design editor with this blank selected
                                key={item.id}
                                className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-200 transition-all cursor-pointer"
                            >
                                <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                        <span className="font-bold text-slate-900">${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {item.colors.map(color => (
                                            <div key={color} className="w-3 h-3 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: color }} />
                                        ))}
                                        {item.colors.length === 0 && <span className="text-[10px] text-slate-400 font-medium">Standard</span>}
                                    </div>
                                    <div className="mt-4 w-full h-9 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex items-center justify-center">
                                        Start Designing
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
