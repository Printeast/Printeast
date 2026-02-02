"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronDown, Check, ChevronRight, ArrowLeft, Shirt, Coffee, Home, ShoppingBag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Data ---

type Category = "Apparel" | "Drinkware" | "Home & Living" | "Accessories"

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
    "Apparel": Shirt,
    "Drinkware": Coffee,
    "Home & Living": Home,
    "Accessories": ShoppingBag
}

interface Product {
    id: string
    name: string
    category: Category
    baseCost: number
    defaultPrice: number
    suggestedPrice: number
    image: string
    color: string
}

const PRODUCTS: Product[] = [
    {
        id: "tshirt-premium",
        name: "Premium Cotton T-Shirt",
        category: "Apparel",
        baseCost: 9.50,
        defaultPrice: 28.00,
        suggestedPrice: 24.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        color: "#E5E7EB"
    },
    {
        id: "hoodie-fleece",
        name: "Heavyweight Fleece Hoodie",
        category: "Apparel",
        baseCost: 22.00,
        defaultPrice: 55.00,
        suggestedPrice: 49.00,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
        color: "#374151"
    },
    {
        id: "ceramic-mug",
        name: "Ceramic Mug (11oz)",
        category: "Drinkware",
        baseCost: 5.50,
        defaultPrice: 16.00,
        suggestedPrice: 14.00,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop",
        color: "#1F2937"
    },
    {
        id: "travel-tumbler",
        name: "Steel Travel Tumbler",
        category: "Drinkware",
        baseCost: 12.00,
        defaultPrice: 32.00,
        suggestedPrice: 29.00,
        image: "https://images.unsplash.com/photo-1576615278798-2340caa95eab?q=80&w=800&auto=format&fit=crop",
        color: "#4B5563"
    },
    {
        id: "canvas-print",
        name: "Stretched Canvas Print",
        category: "Home & Living",
        baseCost: 18.00,
        defaultPrice: 48.00,
        suggestedPrice: 45.00,
        image: "https://plus.unsplash.com/premium_photo-1706152482956-ab99f887763f?q=80&w=687&auto=format&fit=crop",
        color: "#57534E"
    },
    {
        id: "tote-bag",
        name: "Eco Tote Bag",
        category: "Accessories",
        baseCost: 7.00,
        defaultPrice: 22.00,
        suggestedPrice: 19.00,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
        color: "#44403C"
    }
]

// --- Components ---

export function ProfitCalculator() {
    const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]!)
    const [sellingPrice, setSellingPrice] = useState(PRODUCTS[0]!.defaultPrice)
    const [dailySales, setDailySales] = useState(5)

    // New States for functional dropdowns
    const [selectedCountry, setSelectedCountry] = useState("United States ($)")
    const [selectedPeriod, setSelectedPeriod] = useState("Per Month")

    // Reset defaults when product changes
    useEffect(() => {
        setSellingPrice(selectedProduct.defaultPrice)
    }, [selectedProduct])

    const profitPerUnit = sellingPrice - selectedProduct.baseCost
    // Calculate profit based on selected period
    const estimatedProfit = profitPerUnit * dailySales * (selectedPeriod === "Per Year" ? 365 : 30)

    // Dynamic Header Text Animation
    const [headerWord, setHeaderWord] = useState("Brand")
    useEffect(() => {
        const words = ["Brand", "Hobby", "Side Hustle", "Business"]
        let i = 0
        const interval = setInterval(() => {
            i = (i + 1) % words.length
            const nextWord = words[i]
            if (nextWord) setHeaderWord(nextWord)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const aiSuggestedPrice = selectedProduct.suggestedPrice;

    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="container mx-auto px-6 lg:px-16 relative z-10">

                {/* Section Header */}
                <div className="text-left mb-16">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-slate-900">
                        SEE HOW MUCH YOU <br />
                        CAN MAKE FROM YOUR{" "}
                        <span className="relative inline-block w-[6ch] text-left">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={headerWord}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-0 text-blue-600"
                                >
                                    {headerWord}
                                </motion.span>
                            </AnimatePresence>
                            <span className="invisible text-blue-600">HOBBY</span> {/* Spacer in caps */}
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl font-medium leading-relaxed mt-4">
                        Our premium infrastructure ensures high margins. Adjust the values below to estimate your potential monthly earnings.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 lg:p-6 flex flex-col lg:flex-row gap-6 items-center max-w-5xl mx-auto">

                    {/* LEFT: Product Preview */}
                    <motion.div
                        layout
                        className="w-full lg:w-[55%] aspect-[4/5] relative rounded-2xl overflow-hidden bg-[#0B0F17] group will-change-transform"
                    >
                        <Image
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                            sizes="(max-width: 1024px) 100vw, 600px"
                        />

                        {/* Dramatic Bottom Fade (Reference Style) */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Floating Model Series Label (Reference Style) */}
                        <div className="absolute bottom-6 left-6 z-20">
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-2">Model Series</p>
                            <p className="text-white font-extrabold text-2xl leading-tight max-w-[90%]">{selectedProduct.name}</p>
                        </div>


                    </motion.div>


                    {/* RIGHT: Calculator Controls */}
                    <div className="w-full lg:w-[45%] space-y-6 pr-2 lg:pr-6">

                        {/* Product Selector */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Product</label>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    Product cost <span className="text-gray-900 font-bold text-sm">${selectedProduct.baseCost.toFixed(2)}</span>
                                </span>
                            </div>
                            <ProductSelector
                                products={PRODUCTS}
                                selected={selectedProduct}
                                onSelect={setSelectedProduct}
                            />
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4">

                            {/* Sell Price Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-wider">Selling Price</label>
                                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                                        <span className="text-gray-400 font-bold text-sm">$</span>
                                        <input
                                            type="number"
                                            value={sellingPrice}
                                            onChange={(e) => setSellingPrice(Number(e.target.value))}
                                            className="w-16 bg-transparent font-bold text-lg text-right outline-none text-gray-900"
                                        />
                                    </div>
                                </div>
                                <CustomSlider
                                    value={sellingPrice}
                                    min={selectedProduct.baseCost + 1}
                                    max={150}
                                    onChange={setSellingPrice}
                                    formatLabel={(v) => `$${v}`}
                                />
                                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                    <span>${(selectedProduct.baseCost + 1).toFixed(0)}</span>
                                    <span>$150</span>
                                </div>
                            </div>

                            {/* Volume Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-wider">Daily Sales</label>
                                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                                        <input
                                            type="number"
                                            value={dailySales}
                                            onChange={(e) => setDailySales(Number(e.target.value))}
                                            className="w-12 bg-transparent font-bold text-lg text-right outline-none text-gray-900"
                                        />
                                        <span className="text-gray-400 font-bold text-xs">/ day</span>
                                    </div>
                                </div>
                                <CustomSlider
                                    value={dailySales}
                                    min={1}
                                    max={100}
                                    onChange={setDailySales}
                                    formatLabel={(v) => v.toString()}
                                />
                                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                    <span>1 sale</span>
                                    <span>100 sales</span>
                                </div>
                            </div>
                        </div>

                        {/* Result Card */}
                        <div className="space-y-3">

                            {/* Intermediate Selectors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Your country</label>
                                    <SimpleDropdown
                                        options={["United States ($)", "United Kingdom (£)", "Canada (CAD)", "Europe (€)", "India (₹)"]}
                                        selected={selectedCountry}
                                        onSelect={setSelectedCountry}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">View earnings</label>
                                    <SimpleDropdown
                                        options={["Per Month", "Per Year"]}
                                        selected={selectedPeriod}
                                        onSelect={setSelectedPeriod}
                                    />
                                </div>
                            </div>

                            {/* AI Suggestion Banner */}
                            <button
                                onClick={() => setSellingPrice(aiSuggestedPrice)}
                                className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl p-3 flex items-center gap-2.5 shadow-sm transition-colors group/ai"
                            >
                                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 group-hover/ai:scale-110 transition-transform" />
                                <p className="text-xs font-bold text-blue-700">
                                    AI suggests pricing at <span className="underline decoration-blue-300 decoration-2 underline-offset-2">${aiSuggestedPrice}</span> for best conversion
                                </p>
                            </button>

                            <div className="bg-[#0B0F17] rounded-2xl p-6 text-white relative overflow-hidden group">
                                {/* Blue Glow Effect */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/30 transition-colors duration-500" />

                                <div className="relative z-10 flex flex-col gap-4">
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Estimated {selectedPeriod === "Per Month" ? "Monthly" : "Yearly"} Profit</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                                                <AnimatedNumber value={estimatedProfit} />
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full py-3 bg-white text-black hover:bg-gray-100 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.98]">
                                        Start Earning Now
                                    </button>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-gray-300 pl-1">*Estimates based on sales volume</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

// --- Subcomponents ---

function ProductSelector({ products, selected, onSelect }: { products: Product[], selected: Product, onSelect: (p: Product) => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<"categories" | "products">("categories")
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)

    // Group products by category
    const grouped = useMemo(() => {
        const map: Record<string, Product[]> = {}
        products.forEach(p => {
            if (!map[p.category]) map[p.category] = []
            map[p.category]!.push(p)
        })
        return map
    }, [products])

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category as Category)
        setView("products")
    }

    const handleBack = () => {
        setView("categories")
        setActiveCategory(null)
    }

    // Reset view when closing
    useEffect(() => {
        if (isOpen) return

        const t = setTimeout(() => {
            setView("categories")
            setActiveCategory(null)
        }, 300)
        return () => clearTimeout(t)
    }, [isOpen])

    return (
        <div className="relative z-30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 px-4 py-4 rounded-2xl transition-all duration-300 group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-gray-100 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                        <Image src={selected.image} alt={selected.name} fill className="object-cover" />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{selected.category}</span>
                        </div>
                        <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{selected.name}</p>
                    </div>
                </div>
                <div className={cn("w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-blue-50", isOpen && "bg-blue-100 text-blue-600")}>
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180 text-blue-600")} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-gray-100 p-3 z-50 overflow-hidden ring-1 ring-black/5"
                    >
                        <div className="relative w-full overflow-hidden">
                            <motion.div
                                className="w-full"
                                initial={false}
                                animate={{ x: view === "categories" ? "0%" : "-100%" }}
                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            >
                                {/* View 1: Categories */}
                                <div className="w-full space-y-1">
                                    <h4 className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Category</h4>
                                    {Object.keys(grouped).map((category) => {
                                        const Icon = CATEGORY_ICONS[category as Category] || Check;
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryClick(category)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-gray-50 group/item hover:pl-5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-700 group-hover/item:text-gray-900">{category}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-blue-500" />
                                            </button>
                                        )
                                    })}
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute top-0 right-0 w-full h-full"
                                initial={false}
                                animate={{ x: view === "products" ? "0%" : "100%" }}
                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            >
                                {/* View 2: Products */}
                                <div className="w-full h-full flex flex-col">
                                    <div className="flex items-center gap-2 p-2 mb-1 border-b border-gray-50">
                                        <button
                                            onClick={handleBack}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{activeCategory}</span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto max-h-[300px] space-y-1 p-1">
                                        {activeCategory && grouped[activeCategory]?.map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => {
                                                    onSelect(product)
                                                    setIsOpen(false)
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all hover:bg-gray-50",
                                                    selected.id === product.id && "bg-blue-50/80 hover:bg-blue-50 ring-1 ring-blue-100"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg overflow-hidden relative bg-gray-100 border border-gray-100">
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="36px" />
                                                    </div>
                                                    <span className={cn("text-sm font-bold", selected.id === product.id ? "text-blue-700" : "text-gray-600")}>
                                                        {product.name}
                                                    </span>
                                                </div>
                                                {selected.id === product.id && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20"><Check className="w-3 h-3 text-white" /></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function CustomSlider({ value, min, max, onChange, formatLabel }: {
    value: number,
    min: number,
    max: number,
    onChange: (val: number) => void,
    formatLabel: (val: number) => string
}) {
    // Calculate percentage for background fill
    const percentage = ((value - min) / (max - min)) * 100

    return (
        <div className="relative h-5 group cursor-pointer flex items-center" >
            {/* Track Background */}
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full -translate-y-1/2 overflow-hidden">
                {/* Fill - Blue Gradient */}
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Hidden Native Slider for accessibility & functionality */}
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                aria-label={formatLabel(value)}
            />

            {/* Custom Thumb - Positioned via left% */}
            <div
                className="absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md z-10 pointer-events-none transition-transform duration-100 ease-out group-hover:scale-125 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
                style={{ left: `${percentage}%` }}
            >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </div>
        </div>
    )
}

function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value)

    useEffect(() => {
        let start = displayValue
        const end = value
        const duration = 500
        const startTime = performance.now()

        const update = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out expo for a premium feel
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            const current = Math.floor(start + (end - start) * ease)
            setDisplayValue(current)

            if (progress < 1) {
                requestAnimationFrame(update)
            }
        }

        requestAnimationFrame(update)
    }, [value])

    return (
        <span className="tabular-nums will-change-[contents]">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(displayValue)}
        </span>
    )
}

function SimpleDropdown({ options, selected, onSelect }: { options: string[], selected: string, onSelect: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative z-20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left text-sm font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition-all active:scale-95"
            >
                <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{selected}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-20 overflow-hidden"
                        >
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50",
                                        selected === option ? "text-blue-600 bg-blue-50" : "text-gray-600"
                                    )}
                                >
                                    {option}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
