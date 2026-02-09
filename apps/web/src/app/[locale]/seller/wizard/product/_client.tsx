"use client";

import { useState } from "react";
import {
    Search,
    LayoutGrid,
    List,
    Filter,
    Shirt,
    Palette,
    ChevronDown
} from "lucide-react";
import Image from "next/image";

// Mock Data for the Catalog
const CATALOG_CATEGORIES = [
    "Bestsellers",
    "New Arrivals",
    "Eco-friendly",
    "Men's Clothing",
    "Women's Clothing",
    "Kids & Baby",
    "Wall Art",
    "Drinkware",
    "Accessories",
    "Phone Cases",
    "Stationery"
];

const MOCK_PRODUCTS = [
    {
        id: "1",
        name: "Unisex Heavy Blend™ Crewneck Sweatshirt",
        provider: "Gildan 18000",
        price: 9.87,
        currency: "USD",
        colors: 8,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colorsList: ["#FFFFFF", "#000000", "#2563EB", "#DC2626", "#16A34A", "#F59E0B", "#7C3AED", "#DB2777"]
    },
    {
        id: "2",
        name: "Premium Fine Art Matte Paper",
        provider: "Printeast Art",
        price: 3.50,
        currency: "USD",
        colors: 1,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
        sizes: ["8x10", "12x16", "18x24", "24x36"],
        colorsList: ["#FFFFFF"]
    },
    {
        id: "3",
        name: "Unisex Jersey Short Sleeve Tee",
        provider: "Bella+Canvas 3001",
        price: 8.24,
        currency: "USD",
        colors: 12,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        colorsList: ["#FFFFFF", "#000000", "#4B5563", "#EF4444", "#3B82F6", "#10B981", "#8B5CF6"]
    },
    {
        id: "4",
        name: "Classic Dad Hat",
        provider: "Yupoong 6245CM",
        price: 11.50,
        currency: "USD",
        colors: 4,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
        sizes: ["One Size"],
        colorsList: ["#000000", "#FFFFFF", "#1E3A8A", "#064E3B"]
    },
    {
        id: "5",
        name: "Ceramic Mug 11oz",
        provider: "Orca Coatings",
        price: 4.95,
        currency: "USD",
        colors: 2,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
        sizes: ["11oz", "15oz"],
        colorsList: ["#FFFFFF", "#000000"]
    },
    {
        id: "6",
        name: "Heavy Cotton Tee",
        provider: "Gildan 5000",
        price: 6.50,
        currency: "USD",
        colors: 15,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        colorsList: ["#FFFFFF", "#000000", "#6B7280", "#1D4ED8", "#B45309", "#BE123C", "#047857"]
    }
];

import { useRouter } from "next/navigation";

export function WizardCatalogClient() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("Men's clothing");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const bgSoft = "#F9F8F6";

    return (
        <div
            className="min-h-full h-auto w-full relative transition-colors duration-300"
            style={{
                background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
            }}
        >
            <div className="relative z-10 px-10 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                        <div>
                            <h1 className="text-2xl font-black text-foreground tracking-tight">Product Catalog</h1>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Select a base product to customize and add to your store.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                                <Filter className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                <span>Filters</span>
                            </button>
                        </div>
                    </header>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h3 className="text-xs font-black text-foreground uppercase tracking-[0.15em] mb-4">CATEGORIES</h3>
                            <div className="space-y-1">
                                {CATALOG_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                            ? "bg-accent text-accent-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Promo / Help Box */}
                        <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Need Help?</h4>
                            <p className="text-xs text-blue-100 font-medium leading-relaxed mb-4">
                                Not sure which material is best for your design? Check our material guide.
                            </p>
                            <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-colors backdrop-blur-md">
                                View Guide
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Toolbar */}
                        {/* Toolbar */}
                        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 shadow-sm flex flex-col gap-4">
                            {/* Top Row: Search and Preferences */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-lg">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search catalog by product name or brand..."
                                        className="h-10 w-full pl-10 pr-4 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-medium"
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                        <span>Deliver to:</span>
                                        <span className="font-bold text-foreground">North America</span>
                                    </div>
                                    <div className="h-4 w-px bg-border"></div>
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors group">
                                        <span>Currency</span>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-xs font-bold group-hover:border-blue-500 transition-colors">
                                            INR
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Filters & View Options */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border/50">
                                <div className="flex flex-wrap items-center gap-2">
                                    {["Category", "Technology", "Brand", "Color", "Size"].map((filter) => (
                                        <button key={filter} className="flex items-center gap-2 px-3.5 py-2 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-accent hover:border-blue-200 transition-all">
                                            {filter}
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    <select className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                                        <option>Bestsellers First</option>
                                        <option>Lowest Price First</option>
                                        <option>Most Colors First</option>
                                    </select>
                                    <div className="flex p-1 bg-accent rounded-lg">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`h-8 w-10 flex items-center justify-center rounded-md transition-all ${viewMode === "grid"
                                                ? "bg-background text-foreground shadow-sm border border-border"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            <LayoutGrid className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`h-8 w-10 flex items-center justify-center rounded-md transition-all ${viewMode === "list"
                                                ? "bg-background text-foreground shadow-sm border border-border"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            <List className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Featured Highlights (Directly from Inventory design) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="rounded-2xl p-6 text-white shadow-md group relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform transition-transform group-hover:scale-110" />
                                <h3 className="text-lg font-bold tracking-tight">New Arrivals</h3>
                                <p className="text-sm text-white/80 mt-1 font-medium italic">Latest blanks for Q1 2024</p>
                                <button className="mt-4 text-[13px] font-black text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all uppercase tracking-widest">Explore →</button>
                            </div>
                            <div className="rounded-2xl p-6 text-white shadow-md group relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" }}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform transition-transform group-hover:scale-110" />
                                <h3 className="text-lg font-bold tracking-tight">Eco-Collection</h3>
                                <p className="text-sm text-white/80 mt-1 font-medium italic">Sustainable & Organic</p>
                                <button className="mt-4 text-[13px] font-black text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all uppercase tracking-widest">Discover →</button>
                            </div>
                            <div className="rounded-2xl p-6 bg-card border border-border shadow-sm group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent rounded-bl-full transform transition-transform group-hover:scale-110" />
                                <h3 className="text-lg font-bold text-foreground tracking-tight">Custom Samples</h3>
                                <p className="text-sm text-muted-foreground mt-1 font-medium italic">Ordered yours yet?</p>
                                <button className="mt-4 text-[13px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Get Started →</button>
                            </div>
                        </div>

                        {/* Products Area */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                                <h2 className="text-base font-black text-foreground tracking-tight uppercase tracking-widest text-[13px]">{activeCategory}</h2>
                                <div className="px-3 py-1 bg-accent border border-border rounded-full text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {MOCK_PRODUCTS.length} Blanks Available
                                </div>
                            </div>
                            <div className="p-6">
                                {viewMode === "grid" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                                        {MOCK_PRODUCTS.map((product, idx) => (
                                            <div key={product.id} className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1.5 duration-500">
                                                <div className="aspect-square relative bg-accent/30 overflow-hidden">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.98] group-hover:brightness-100"
                                                        unoptimized
                                                        priority={idx < 3}
                                                    />
                                                    {product.bestseller && (
                                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-[4px] shadow-lg z-10 flex items-center gap-1.5 border border-white/10 backdrop-blur-md">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                            Bestseller
                                                        </div>
                                                    )}

                                                    {/* Hover Slide Up Panel */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {product.sizes?.map((size, i) => (
                                                                <span key={i} className="px-2 py-1 rounded-md border border-slate-200 text-[11px] font-black text-slate-700 bg-white shadow-sm">
                                                                    {size}
                                                                </span>
                                                            ))}
                                                            {product.sizes && product.sizes.length > 5 && (
                                                                <span className="px-2 py-1 rounded-md border border-slate-200 text-[11px] font-black text-slate-400 bg-slate-50">
                                                                    +2
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                                            {product.colorsList?.slice(0, 7).map((color, i) => (
                                                                <div key={i} className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: color }} />
                                                            ))}
                                                            {product.colorsList && product.colorsList.length > 7 && (
                                                                <span className="text-[10px] font-bold text-slate-400 ml-0.5">+{product.colorsList.length - 7}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-5 space-y-4">
                                                    <div>
                                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2">{product.provider}</p>
                                                        <h4 className="font-black text-foreground leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 text-[17px]">{product.name}</h4>
                                                        <div className="flex items-center gap-3 mt-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <Palette className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="text-[11px] font-bold text-slate-500">{product.colors} colors</span>
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <div className="flex items-center gap-1.5">
                                                                <Shirt className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="text-[11px] font-bold text-slate-500">S - 5XL</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">From</span>
                                                            <span className="text-lg font-black text-slate-900 tracking-tight">${product.price.toFixed(2)}</span>
                                                        </div>
                                                        <button
                                                            className="px-6 py-2.5 bg-[#0f172a] hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.1em] rounded-xl transition-all shadow-md active:scale-95 translate-y-0 group-hover:-translate-y-1 duration-300"
                                                        >
                                                            Design
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {MOCK_PRODUCTS.map((item) => (
                                            <div key={item.id} className="flex items-center gap-6 p-4 bg-card border border-border rounded-2xl hover:border-blue-400/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                                                <div className="w-24 h-24 relative bg-accent border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50/30 transition-colors overflow-hidden">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-2">{item.provider}</p>
                                                    <h4 className="text-[16px] font-black text-foreground truncate group-hover:text-blue-600 transition-colors tracking-tight">{item.name}</h4>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Palette className="w-3 h-3" /> {item.colors} colors
                                                        </p>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Shirt className="w-3 h-3" /> All Sizes
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Starting at</p>
                                                        <p className="text-xl font-black text-slate-900 tracking-tighter">${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push(`/seller/wizard/design?productId=${item.id}&provider=${item.provider}`)}
                                                        className="px-5 py-2 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Start Designing →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
