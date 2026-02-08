"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Home, Coffee, Book, Mail, Calendar, MoreHorizontal, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "clothing", label: "Clothing & Apparel", icon: Shirt },
  { id: "home-decor", label: "Home Decor & Wall Art", icon: Home },
  { id: "drinkware", label: "Drinkware & Kitchenware", icon: Coffee },
  { id: "photo-books", label: "Photo Books & Albums", icon: Book },
  { id: "stationery", label: "Greeting Cards & Stationery", icon: Mail },
  { id: "calendars", label: "Calendars & Planners", icon: Calendar },
  { id: "other", label: "Other", icon: MoreHorizontal, hasInput: true }
];

export function ProductInterestStep() {
  const { nextStep, setAnswer } = useOnboardingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customInterest, setCustomInterest] = useState("");

  const handleSelect = (prod: typeof PRODUCTS[0]) => {
    if (!prod.hasInput) {
      setAnswer("productInterest", [prod.label]);
      nextStep();
    } else {
      setSelectedId(prod.id);
    }
  };

  const handleCustomSubmit = () => {
    if (customInterest.trim()) {
      setAnswer("productInterest", [customInterest]);
      nextStep();
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Which product categories interest you?
        </h2>
        <p className="text-sm text-neutral-500">
          Select your primary interest.
        </p>
      </motion.div>

      <div data-lenis-prevent className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {PRODUCTS.map((prod, index) => {
          const isSelected = selectedId === prod.id;

          return (
            <motion.button
              key={prod.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(prod)}
              className={cn(
                "group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200",
                isSelected && "border-black shadow-md ring-1 ring-black/5"
              )}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={cn(
                  "min-w-10 h-10 md:min-w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                  isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                )}>
                  <prod.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <span className={cn(
                  "font-bold text-neutral-800 text-base md:text-lg transition-colors leading-tight",
                  isSelected ? "text-black" : "group-hover:text-black"
                )}>
                  {prod.label}
                </span>
              </div>
              {isSelected ? (
                <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0 ml-4" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedId === "other" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 max-w-[480px] mx-auto w-full"
          >
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-neutral-900 px-1">
                Tell us about your custom interest:
              </label>
              <div className="flex gap-2">
                <Input
                  autoFocus
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Tell us what you're looking for..."
                  className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customInterest.trim()) handleCustomSubmit();
                  }}
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customInterest.trim()}
                  className="h-12 px-6 bg-black text-white rounded-lg font-medium text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
