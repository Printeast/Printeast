"use client";

import { useState } from "react";
import {
    Search,
    LayoutGrid,
    List,
    Shirt,
    Palette,
    ChevronDown
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

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
    "Stationery",
    "General"
];

// Product Card Interface for Real Data
export interface ProductCard {
    id: string;
    sku: string;
    name: string;
    basePrice: number;
    description: string;
    images: string[];
    options: any;
    provider: string;
    stockStatus: string;
    tags: string[];
    category: string;
}

export interface ProductCatalogProps {
    onProductSelect?: (productId: string) => void;
    basePath?: string;
    initialProducts?: ProductCard[] | undefined;
    categories?: string[];
}

const CURRENCY_RATES: Record<string, number> = {
    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.35,
    AUD: 1.52,
};

const SYMBOLS: Record<string, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
};

const LOCATIONS = [
    "North America",
    "Europe",
    "India",
    "Asia",
    "Australia",
    "Global",
];

export function ProductCatalog({ onProductSelect, basePath, initialProducts = [], categories }: ProductCatalogProps) {
    const router = useRouter();

    const defaultCats = ["Men's Clothing", "Accessories", "General"];
    const displayCategories = categories && categories.length > 0 ? categories : (CATALOG_CATEGORIES.length > 0 ? CATALOG_CATEGORIES : defaultCats);

    // Ensure activeCategory is never undefined
    const [activeCategory, setActiveCategory] = useState("All");

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    // Sorting and Advanced Filters State
    const [selectedTech, setSelectedTech] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");
    const [selectedSize, setSelectedSize] = useState("All");
    const [sortBy, setSortBy] = useState("Bestsellers First");
    const [currency, setCurrency] = useState("USD");
    const [deliveryLoc, setDeliveryLoc] = useState("North America");
    const [shipFrom, setShipFrom] = useState("Global");

    const convertPrice = (price: number) => {
        const rate = CURRENCY_RATES[currency] || 1;
        const symbol = SYMBOLS[currency] || '$';
        return `${symbol}${(price * rate).toFixed(2)}`;
    };

    // Deriving Filter Options
    const allCategories = ["All", ...displayCategories];
    const allTechs = ["All", ...Array.from(new Set(initialProducts.flatMap(p => p.tags).filter(t => ["DTG", "Embroidery", "Sublimation", "Digital Print", "Apparel"].includes(t))))];
    const allBrands = ["All", ...Array.from(new Set(initialProducts.map(p => p.provider)))];
    const allColors = ["All", ...Array.from(new Set(initialProducts.flatMap(p => p.options?.colors?.map((c: any) => c.name) || [])))];
    const allSizes = ["All", ...Array.from(new Set(initialProducts.flatMap(p => p.options?.sizes || [])))];


    const bgSoft = "#F9F8F6";

    // Display helpers
    const cleanDisplay = (text: string) => {
        if (!text) return text;
        return text.replace(/,.*$/g, '').replace(/Ä≥/g, '').replace(/√ó/g, 'x').replace(/Ã—/g, 'x');
    };

    const isFilterActive = (val: string) => val !== "All";

    // Filtering logic
    const filteredProducts = initialProducts.filter(p => {
        const matchesCategory = activeCategory === "All" ||
            activeCategory === "Bestsellers" ||
            activeCategory === "New Arrivals" ||
            p.category.toLowerCase() === activeCategory.toLowerCase() ||
            p.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());

        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTech = selectedTech === "All" || p.tags.includes(selectedTech);
        const matchesBrand = selectedBrand === "All" || p.provider === selectedBrand;
        const matchesColor = selectedColor === "All" || p.options?.colors?.some((c: any) => c.name === selectedColor);
        const matchesSize = selectedSize === "All" || p.options?.sizes?.includes(selectedSize);

        return matchesCategory && matchesSearch && matchesTech && matchesBrand && matchesColor && matchesSize;
    })
        .sort((a, b) => {
            if (sortBy === "Lowest Price First") return a.basePrice - b.basePrice;
            if (sortBy === "Most Colors First") return (b.options?.colors?.length || 0) - (a.options?.colors?.length || 0);
            if (sortBy === "Bestsellers First") {
                const aBest = a.tags.includes("Best Seller") ? 1 : 0;
                const bBest = b.tags.includes("Best Seller") ? 1 : 0;
                return bBest - aBest;
            }
            return 0;
        });

    const handleProductClick = (productId: string) => {
        if (onProductSelect) {
            onProductSelect(productId);
            return;
        }

        // Default behavior: go to wizard flow using the provided basePath or default
        const path = basePath || "/seller/wizard/product";
        router.push(`${path}/${productId}`);
    };

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
                    </header>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h3 className="text-xs font-black text-foreground uppercase tracking-[0.15em] mb-4">CATEGORIES</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveCategory("All")}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === "All"
                                        ? "bg-accent text-accent-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                        }`}
                                >
                                    All Products
                                </button>
                                {displayCategories.map((cat) => (

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
                        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 shadow-sm flex flex-col gap-4">
                            {/* Top Row: Search and Preferences */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-lg">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search catalog by product name or brand..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 w-full pl-10 pr-4 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-medium"
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                    {/* Ship From */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                                <span>From:</span>
                                                <span className="font-bold text-foreground">{shipFrom}</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Ship From</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={shipFrom} onValueChange={setShipFrom}>
                                                {LOCATIONS.map(loc => (
                                                    <DropdownMenuRadioItem key={loc} value={loc}>{loc}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div className="h-4 w-px bg-border"></div>

                                    {/* Deliver To */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                                <span>To:</span>
                                                <span className="font-bold text-foreground">{deliveryLoc}</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Deliver To</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={deliveryLoc} onValueChange={setDeliveryLoc}>
                                                {LOCATIONS.map(loc => (
                                                    <DropdownMenuRadioItem key={loc} value={loc}>{loc}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div className="h-4 w-px bg-border"></div>

                                    {/* Currency */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors group">
                                                <span>Currency</span>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-xs font-bold group-hover:border-blue-500 transition-colors">
                                                    {currency}
                                                    <ChevronDown className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Currency</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                                                {Object.keys(CURRENCY_RATES).map(c => (
                                                    <DropdownMenuRadioItem key={c} value={c}>{c} ({SYMBOLS[c]})</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Bottom Row: Filters & View Options */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border/50">
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Filter: Category */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-bold transition-all ${isFilterActive(activeCategory)
                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                : "bg-background border-border text-foreground hover:bg-accent hover:border-blue-200"
                                                }`}>
                                                Category: {activeCategory}
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Category</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={activeCategory} onValueChange={setActiveCategory}>
                                                <DropdownMenuRadioItem value="All">All Categories</DropdownMenuRadioItem>
                                                {allCategories.filter(c => c !== "All").map(c => (
                                                    <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Filter: Technology */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-bold transition-all ${isFilterActive(selectedTech)
                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                : "bg-background border-border text-foreground hover:bg-accent hover:border-blue-200"
                                                }`}>
                                                Tech: {selectedTech}
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Technology</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={selectedTech} onValueChange={setSelectedTech}>
                                                <DropdownMenuRadioItem value="All">All Tech</DropdownMenuRadioItem>
                                                {allTechs.filter(t => t !== "All").map(t => (
                                                    <DropdownMenuRadioItem key={t} value={t}>{t}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Filter: Brand */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-bold transition-all ${isFilterActive(selectedBrand)
                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                : "bg-background border-border text-foreground hover:bg-accent hover:border-blue-200"
                                                }`}>
                                                Brand: {selectedBrand}
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Brand</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={selectedBrand} onValueChange={setSelectedBrand}>
                                                <DropdownMenuRadioItem value="All">All Brands</DropdownMenuRadioItem>
                                                {allBrands.filter(b => b !== "All").map(b => (
                                                    <DropdownMenuRadioItem key={b} value={b}>{b}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Filter: Color */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-bold transition-all ${isFilterActive(selectedColor)
                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                : "bg-background border-border text-foreground hover:bg-accent hover:border-blue-200"
                                                }`}>
                                                Color: {selectedColor}
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Color</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                                                <DropdownMenuRadioItem value="All">All Colors</DropdownMenuRadioItem>
                                                {allColors.filter(c => c !== "All").map(c => (
                                                    <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Filter: Size */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-bold transition-all ${isFilterActive(selectedSize)
                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                : "bg-background border-border text-foreground hover:bg-accent hover:border-blue-200"
                                                }`}>
                                                Size: {cleanDisplay(selectedSize)}
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Size</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                                                <DropdownMenuRadioItem value="All">All Sizes</DropdownMenuRadioItem>
                                                {allSizes.filter(s => s !== "All").map(s => (
                                                    <DropdownMenuRadioItem key={s} value={s}>{cleanDisplay(s)}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>


                                    {(selectedTech !== "All" || selectedBrand !== "All" || selectedColor !== "All" || selectedSize !== "All" || activeCategory !== "All") && (
                                        <button
                                            onClick={() => {
                                                setSelectedTech("All");
                                                setSelectedBrand("All");
                                                setSelectedColor("All");
                                                setSelectedSize("All");
                                                setActiveCategory("All");
                                            }}
                                            className="text-xs font-black text-blue-600 hover:text-blue-700 px-3 py-2 bg-blue-50/50 rounded-lg transition-colors border border-blue-100/50"
                                        >
                                            Reset Filters
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer flex items-center gap-2">
                                                {sortBy}
                                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                                <DropdownMenuRadioItem value="Bestsellers First">Bestsellers First</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Lowest Price First">Lowest Price First</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Most Colors First">Most Colors First</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                                    {filteredProducts.length} Blanks Available
                                </div>
                            </div>
                            <div className="p-6">
                                {filteredProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">No products found</h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-xs">We couldn't find any products in "{activeCategory}" matching your search.</p>
                                        <button
                                            onClick={() => { setActiveCategory("Men's Clothing"); setSearchQuery(""); }}
                                            className="mt-6 text-sm font-black text-blue-600 hover:text-blue-700 underline underline-offset-4"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                ) : viewMode === "grid" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {filteredProducts.map((product, idx) => (
                                            <div
                                                key={product.id}
                                                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500"
                                            >
                                                {/* Gradient accent strip */}
                                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

                                                {/* Image */}
                                                <div className="aspect-square relative bg-slate-50 overflow-hidden">
                                                    <Image
                                                        src={product.images[0] || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80"}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        unoptimized
                                                        priority={idx < 3}
                                                    />
                                                    {product.tags.includes("Best Seller") && (
                                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg z-10 flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                                                            Bestseller
                                                        </div>
                                                    )}

                                                    {/* Hover Slide Up Panel */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {product.options?.sizes?.slice(0, 5).map((size: string, i: number) => (
                                                                <span key={i} className="px-2.5 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-600 bg-white">
                                                                    {size}
                                                                </span>
                                                            ))}
                                                            {product.options?.sizes && product.options.sizes.length > 5 && (
                                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-400 bg-slate-50">
                                                                    +{product.options.sizes.length - 5}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                                            {product.options?.colors?.slice(0, 7).map((color: any, i: number) => (
                                                                <div key={i} title={color.name} className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200" style={{ backgroundColor: color.hex }} />
                                                            ))}
                                                            {product.options?.colors && product.options.colors.length > 7 && (
                                                                <span className="text-[10px] font-bold text-slate-400 ml-1">+{product.options.colors.length - 7}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <h4 className="font-bold text-slate-900 leading-snug line-clamp-2 text-[15px] group-hover:text-blue-600 transition-colors duration-300">{product.name}</h4>
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-full">
                                                            <Palette className="w-3 h-3 text-slate-400" />
                                                            <span className="text-[10px] font-semibold text-slate-500">{product.options?.colors?.length || 0} colors</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-full">
                                                            <Shirt className="w-3 h-3 text-slate-400" />
                                                            <span className="text-[10px] font-semibold text-slate-500">{product.options?.sizes?.length || 0} sizes</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                                                        <div>
                                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">From</span>
                                                            <span className="text-xl font-extrabold text-slate-900 tracking-tight">{convertPrice(product.basePrice)}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleProductClick(product.id)}
                                                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.97] duration-200"
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredProducts.map((item) => (
                                            <div key={item.id} className="flex items-center gap-5 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer group">
                                                <div className="w-24 h-24 relative bg-slate-50 border border-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                                                    <Image src={item.images[0] || ""} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[15px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors duration-300">{item.name}</h4>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 px-2 py-0.5 bg-slate-50 rounded-full">
                                                            <Palette className="w-3 h-3 text-slate-400" /> {item.options?.colors?.length || 0} colors
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 px-2 py-0.5 bg-slate-50 rounded-full">
                                                            <Shirt className="w-3 h-3 text-slate-400" /> {item.options?.sizes?.length || 0} sizes
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2.5 flex-shrink-0">
                                                    <div>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5 text-right">From</p>
                                                        <p className="text-lg font-extrabold text-slate-900 tracking-tight">{convertPrice(item.basePrice)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleProductClick(item.id)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-[0.97] duration-200"
                                                    >
                                                        Select →
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
