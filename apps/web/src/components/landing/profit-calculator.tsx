"use client"

import { useState, useMemo, useEffect, memo } from "react"
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"
import { ChevronDown, Check, ChevronRight, ArrowLeft, Shirt, Coffee, Home, ShoppingBag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

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
        baseCost: 12.00,
        defaultPrice: 28.00,
        suggestedPrice: 35.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        color: "#E5E7EB"
    },
    {
        id: "hoodie-fleece",
        name: "Heavyweight Fleece Hoodie",
        category: "Apparel",
        baseCost: 24.50,
        defaultPrice: 59.00,
        suggestedPrice: 75.00,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
        color: "#374151"
    },
    {
        id: "ceramic-mug",
        name: "Ceramic Mug (11oz)",
        category: "Drinkware",
        baseCost: 6.25,
        defaultPrice: 18.00,
        suggestedPrice: 22.00,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop",
        color: "#1F2937"
    },
    {
        id: "travel-tumbler",
        name: "Steel Travel Tumbler",
        category: "Drinkware",
        baseCost: 14.50,
        defaultPrice: 38.00,
        suggestedPrice: 45.00,
        image: "https://images.unsplash.com/photo-1576615278798-2340caa95eab?q=80&w=800&auto=format&fit=crop",
        color: "#4B5563"
    },
    {
        id: "canvas-print",
        name: "Stretched Canvas Print",
        category: "Home & Living",
        baseCost: 28.00,
        defaultPrice: 75.00,
        suggestedPrice: 95.00,
        image: "https://plus.unsplash.com/premium_photo-1706152482956-ab99f887763f?q=80&w=687&auto=format&fit=crop",
        color: "#57534E"
    },
    {
        id: "tote-bag",
        name: "Eco Tote Bag",
        category: "Accessories",
        baseCost: 8.50,
        defaultPrice: 24.00,
        suggestedPrice: 32.00,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
        color: "#44403C"
    }
]

// --- Components ---

export function ProfitCalculator() {
    const t = useTranslations('ProfitCalculator');
    const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]!)
    const [sellingPrice, setSellingPrice] = useState(PRODUCTS[0]!.defaultPrice)
    const [dailySales, setDailySales] = useState(5)
    const words = useMemo(() => t.raw('words') as string[], [t]);

    const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("month")
    const [selectedRegion, setSelectedRegion] = useState("India")
    const [showPriceCallout, setShowPriceCallout] = useState(false)
    const [showSalesCallout, setShowSalesCallout] = useState(false)

    const REGION_DATA: Record<string, { symbol: string, rate: number, label: string }> = {
        "India": { symbol: "₹", rate: 83, label: "India (₹)" },
        "USA": { symbol: "$", rate: 1, label: "United States ($)" },
        "Europe": { symbol: "€", rate: 0.92, label: "Europe (€)" },
        "UK": { symbol: "£", rate: 0.79, label: "United Kingdom (£)" },
        "Canada": { symbol: "CA$", rate: 1.36, label: "Canada (CA$)" },
        "Global": { symbol: "$", rate: 1, label: "Global ($)" }
    }

    const currentRegion = REGION_DATA[selectedRegion] || REGION_DATA["India"]!

    // Reset defaults when product changes
    useEffect(() => {
        setSellingPrice(selectedProduct.defaultPrice)
    }, [selectedProduct])

    const formatValue = (val: number) => Math.round(val * currentRegion.rate)

    const profitPerUnit = sellingPrice - selectedProduct.baseCost
    // Calculate profit based on selected period
    const rawProfit = profitPerUnit * dailySales * (selectedPeriod === "year" ? 365 : 30)
    const estimatedProfit = formatValue(rawProfit)

    const aiSuggestedPrice = selectedProduct.suggestedPrice
    const REGIONS = Object.keys(REGION_DATA)

    const headerContent = useMemo(() => (
        <div className="flex flex-col space-y-6 lg:translate-y-[-10%]">
            <h2 className="text-3xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-slate-900 mb-4 whitespace-normal">
                <div className="block whitespace-nowrap">{t('titlePart1')}</div>
                <div className="block whitespace-nowrap">{t('titlePart2')}</div>
                <div className="block mt-2">
                    <RollingHeader words={words} />
                </div>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                {t('subtitle')}
            </p>
        </div>
    ), [t, words])

    const PRICE_LIMIT = 1000000 / currentRegion.rate
    const SALES_LIMIT = 10000

    // Auto-hide callouts after 2.5s
    useEffect(() => {
        if (showPriceCallout) {
            const timer = setTimeout(() => setShowPriceCallout(false), 2500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [showPriceCallout])

    useEffect(() => {
        if (showSalesCallout) {
            const timer = setTimeout(() => setShowSalesCallout(false), 2500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [showSalesCallout])

    const handlePriceInputChange = (val: string) => {
        if (val === "") {
            setSellingPrice(0) // Visual clearing, effectively 0 USD
            return
        }
        const num = Number(val)
        if (isNaN(num)) return

        const usdPrice = num / currentRegion.rate
        if (usdPrice > PRICE_LIMIT) setSellingPrice(PRICE_LIMIT)
        else setSellingPrice(usdPrice)
    }

    const handleSalesInputChange = (val: string) => {
        if (val === "") {
            setDailySales(0)
            return
        }
        const num = Number(val)
        if (isNaN(num)) return

        if (num > SALES_LIMIT) setDailySales(SALES_LIMIT)
        else setDailySales(num)
    }

    return (
        <section className="py-32 bg-transparent relative overflow-hidden transform-gpu">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[0.8fr,3.2fr] gap-8 lg:gap-12 items-center">

                    {/* LEFT: Text Content */}
                    {headerContent}

                    {/* RIGHT: Calculator Interactive Card */}
                    <div className="w-full">
                        <div className="bg-white rounded-3xl border border-gray-100 p-4 lg:py-5 lg:px-6 flex flex-col lg:flex-row gap-8 items-center w-full shadow-[0_25px_60px_rgba(0,0,0,0.06)] relative z-10 [transform:translateZ(0)] [backface-visibility:hidden]">

                            {/* LEFT: Product Preview */}
                            <motion.div
                                className="w-full lg:w-[45%] aspect-[2/3.8] relative rounded-2xl overflow-hidden bg-[#0B0F17] group shadow-xl"
                            >
                                <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 will-change-transform"
                                    sizes="(max-width: 1024px) 100vw, 600px"
                                    loading="lazy"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-black/95 to-transparent" />
                                <div className="absolute bottom-12 left-12 z-20">
                                    <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.25em] mb-3">{t('modelSeries')}</p>
                                    <p className="text-white font-black text-4xl lg:text-5xl leading-[1.1] max-w-[90%]">{selectedProduct.name}</p>
                                </div>
                            </motion.div>

                            {/* RIGHT: Calculator Controls */}
                            <div className="w-full lg:w-[55%] space-y-2 pr-2">
                                {/* Product Selector */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{t('selectProduct')}</label>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                                            {t('productCost')} <span className="text-gray-900 font-black text-sm">{currentRegion.symbol}{formatValue(selectedProduct.baseCost).toLocaleString()}</span>
                                        </span>
                                    </div>
                                    <ProductSelector
                                        products={PRODUCTS}
                                        selected={selectedProduct}
                                        onSelect={setSelectedProduct}
                                        t={t}
                                    />
                                </div>

                                {/* Sliders */}
                                <div className="space-y-4">
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-none">{t('sellingPrice')}</label>
                                            <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-1.5 rounded-lg border border-gray-100">
                                                <span className="text-gray-400 font-bold text-sm">{currentRegion.symbol}</span>
                                                <input
                                                    type="number"
                                                    value={formatValue(sellingPrice)}
                                                    onChange={(e) => handlePriceInputChange(e.target.value)}
                                                    className="w-20 bg-transparent font-black text-xl text-right outline-none text-gray-900 tabular-nums"
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <CustomSlider
                                                value={sellingPrice}
                                                min={0}
                                                max={selectedProduct.suggestedPrice * 2}
                                                onChange={(v) => {
                                                    setSellingPrice(v)
                                                    if (v >= selectedProduct.suggestedPrice * 2) setShowPriceCallout(true)
                                                    else setShowPriceCallout(false)
                                                }}
                                                formatLabel={(v) => `${currentRegion.symbol}${formatValue(v)}`}
                                                minLabel={`${currentRegion.symbol}${formatValue(0)}`}
                                                maxLabel={`${currentRegion.symbol}${formatValue(selectedProduct.suggestedPrice * 2)}`}
                                            />
                                            <AnimatePresence>
                                                {showPriceCallout && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        className="absolute -top-[110px] right-[-12px] bg-blue-600 text-white text-[9px] font-black px-3 py-2.5 rounded-xl shadow-2xl z-50 pointer-events-none text-right leading-tight"
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <Sparkles className="w-3 h-3 text-blue-200 mt-0.5" />
                                                            <div>
                                                                {t.rich('manualInputCallout', {
                                                                    limit: `${currentRegion.symbol}${formatValue(selectedProduct.suggestedPrice * 2)}`,
                                                                    blue: (chunks) => <span className="text-blue-100">{chunks}</span>,
                                                                    br: () => <br />
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-full right-6 w-2.5 h-2.5 bg-blue-600 rotate-45 -translate-y-1/2" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-none">{t('dailySales')}</label>
                                            <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-1.5 rounded-lg border border-gray-100">
                                                <input
                                                    type="number"
                                                    value={dailySales}
                                                    onChange={(e) => handleSalesInputChange(e.target.value)}
                                                    className="w-12 bg-transparent font-black text-xl text-right outline-none text-gray-900 tabular-nums"
                                                />
                                                <span className="text-gray-400 font-bold text-xs">/ day</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <CustomSlider
                                                value={dailySales}
                                                min={1}
                                                max={100}
                                                onChange={(v) => {
                                                    setDailySales(v)
                                                    if (v >= 100) setShowSalesCallout(true)
                                                    else setShowSalesCallout(false)
                                                }}
                                                formatLabel={(v) => v.toString()}
                                                minLabel="1 sale"
                                                maxLabel="100 sales"
                                            />
                                            <AnimatePresence>
                                                {showSalesCallout && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        className="absolute -top-[110px] right-[-12px] bg-blue-600 text-white text-[9px] font-black px-3 py-2.5 rounded-xl shadow-2xl z-50 pointer-events-none text-right leading-tight"
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <Sparkles className="w-3 h-3 text-blue-200 mt-0.5" />
                                                            <div>
                                                                {t.rich('manualInputCallout', {
                                                                    limit: '100',
                                                                    blue: (chunks) => <span className="text-blue-100">{chunks}</span>,
                                                                    br: () => <br />
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-full right-6 w-2.5 h-2.5 bg-blue-600 rotate-45 -translate-y-1/2" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Region & Period - Dropdown Style */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">{t('yourCountry')}</label>
                                        <div className="relative group/sel">
                                            <button className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:border-blue-400 transition-colors">
                                                <span className="text-sm font-bold text-gray-900">{currentRegion.label}</span>
                                                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover/sel:translate-y-0.5" />
                                            </button>
                                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover/sel:opacity-100 group-hover/sel:visible transition-all z-40 p-1">
                                                {REGIONS.map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => setSelectedRegion(r)}
                                                        className={cn("w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-colors hover:bg-gray-50", selectedRegion === r ? "text-blue-600 bg-blue-50/50" : "text-gray-600")}
                                                    >
                                                        {REGION_DATA[r]?.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">VIEW EARNINGS</label>
                                        <button
                                            onClick={() => setSelectedPeriod(selectedPeriod === "month" ? "year" : "month")}
                                            className="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:border-blue-400 transition-colors group/period"
                                        >
                                            <span className="text-sm font-bold text-gray-900">{selectedPeriod === "month" ? t('monthly') : t('yearly')}</span>
                                            <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover/period:translate-y-0.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Results Area */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setSellingPrice(aiSuggestedPrice)}
                                        className="w-full text-left bg-blue-50/50 hover:bg-blue-50/80 border border-blue-100/50 rounded-xl p-3 flex items-center gap-3 transition-colors group/ai"
                                    >
                                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                                        <div className="text-xs font-bold text-blue-600">
                                            {t.rich('aiSuggestion', {
                                                price: () => <span className="text-blue-700 underline decoration-blue-300 decoration-2 underline-offset-2 font-black">{currentRegion.symbol}{formatValue(aiSuggestedPrice)}</span>
                                            })}
                                        </div>
                                    </button>

                                    <div className="bg-[#0B0F17] rounded-2xl p-6 text-white relative overflow-hidden group transform-gpu shadow-xl">
                                        <div className="relative z-10 flex flex-col gap-5">
                                            <div className="space-y-1">
                                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                                    ESTIMATED {selectedPeriod === "month" ? 'MONTHLY' : 'YEARLY'} PROFIT
                                                </p>
                                                <div className="text-5xl lg:text-7xl font-black tracking-tighter text-white flex items-baseline gap-2">
                                                    <span className="text-2xl lg:text-3xl text-gray-400">{currentRegion.symbol}</span>
                                                    <AnimatedNumber value={estimatedProfit} />
                                                </div>
                                            </div>
                                            <button className="w-full py-4.5 bg-white text-black hover:bg-gray-100 rounded-xl font-black text-lg transition-all active:scale-[0.98] shadow-lg">
                                                {t('startEarning')}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400/60 px-1 text-center">{t('estimates')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- Subcomponents ---

const ProductSelector = memo(({ products, selected, onSelect, t }: { products: Product[], selected: Product, onSelect: (p: Product) => void, t: any }) => {
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
                className="w-full flex items-center justify-between bg-white border border-gray-100 px-4 py-4 rounded-xl hover:border-blue-200 shadow-sm transition-all duration-300 group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-gray-100 border border-gray-100 group-hover:scale-105 transition-transform">
                        <Image src={selected.image} alt={selected.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">{selected.category}</p>
                        <p className="text-base font-black text-gray-900">{selected.name}</p>
                    </div>
                </div>
                <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-blue-50", isOpen && "bg-blue-600 text-white")}>
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", isOpen && "rotate-180 text-white")} />
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
                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-md border border-gray-100 p-3 z-50 overflow-hidden ring-1 ring-black/5"
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
                                    <h4 className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('selectProduct')}</h4>
                                    {Object.keys(grouped).map((category) => {
                                        const Icon = CATEGORY_ICONS[category as Category] || Check;
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryClick(category)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-md transition-all hover:bg-gray-50 group/item hover:pl-5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-700 group-hover/item:text-gray-900">{t(`categories.${category}`)}</span>
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
                                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{t(`categories.${activeCategory}`)}</span>
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
                                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all hover:bg-gray-50",
                                                    selected.id === product.id && "bg-blue-50/80 hover:bg-blue-50 ring-1 ring-blue-100"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-md overflow-hidden ring-2 ring-slate-100">
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="36px" />
                                                    </div>
                                                    <span className={cn("text-sm font-bold", selected.id === product.id ? "text-blue-700" : "text-gray-600")}>
                                                        {product.name}
                                                    </span>
                                                </div>
                                                {selected.id === product.id && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
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
})

const CustomSlider = memo(({ value, min, max, onChange, formatLabel, minLabel, maxLabel }: {
    value: number,
    min: number,
    max: number,
    onChange: (val: number) => void,
    formatLabel: (val: number) => string,
    minLabel?: string,
    maxLabel?: string
}) => {
    // Calculate percentage for background fill
    const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)

    return (
        <div className="space-y-3">
            <div className="relative h-6 group cursor-pointer flex items-center" >
                {/* Track Background */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full -translate-y-1/2 overflow-hidden">
                    {/* Fill - Blue Gradient */}
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Hidden Native Slider for accessibility & functionality */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={(max - min) / 200}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    aria-label={formatLabel(value)}
                />

                {/* Custom Thumb - Perfectly bound with translate */}
                <div
                    className="absolute w-6 h-6 bg-white border-[3px] border-blue-600 rounded-full z-10 pointer-events-none group-hover:scale-110 flex items-center justify-center shadow-md shadow-blue-200 will-change-transform"
                    style={{
                        left: `${percentage}%`,
                        top: '50%',
                        transform: `translate(-${percentage}%, -50%)`
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                </div>
            </div>
            {(minLabel || maxLabel) && (
                <div className="flex justify-between px-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{minLabel}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{maxLabel}</span>
                </div>
            )}
        </div>
    )
})

const RollingHeader = memo(({ words }: { words: string[] }) => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (!words || words.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [words])

    const word = words[index] || ""

    return (
        <span className="relative inline-flex min-w-[10ch] h-[1.1em] items-center text-blue-600">
            <AnimatePresence mode="wait">
                <motion.span
                    key={word}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0"
                >
                    {word}
                </motion.span>
            </AnimatePresence>
            <span className="invisible">Side Hustle</span>
        </span>
    )
})

const AnimatedNumber = memo(({ value }: { value: number }) => {
    const motionValue = useMotionValue(value)
    const springValue = useSpring(motionValue, {
        stiffness: 400,
        damping: 40
    })

    useEffect(() => {
        motionValue.set(value)
    }, [value, motionValue])

    const displayValue = useTransform(springValue, (latest) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.floor(latest))
    )

    return (
        <motion.span className="tabular-nums">
            {displayValue}
        </motion.span>
    )
})

