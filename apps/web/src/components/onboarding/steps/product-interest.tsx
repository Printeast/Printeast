"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion } from "framer-motion";
import { Shirt, Home, Coffee, Book, Mail, Calendar, MoreHorizontal, ChevronRight } from "lucide-react";

const PRODUCTS = [
  { id: "clothing", label: "Clothing & Apparel", icon: Shirt },
  { id: "home-decor", label: "Home Decor & Wall Art", icon: Home },
  { id: "drinkware", label: "Drinkware & Kitchenware", icon: Coffee },
  { id: "photo-books", label: "Photo Books & Albums", icon: Book },
  { id: "stationery", label: "Greeting Cards & Stationery", icon: Mail },
  { id: "calendars", label: "Calendars & Planners", icon: Calendar },
  { id: "other", label: "Other", icon: MoreHorizontal }
];

export function ProductInterestStep() {
  const { nextStep, setAnswer } = useOnboardingStore();

  const handleSelect = (id: string) => {
    setAnswer("productInterest", [id]);
    nextStep();
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

      <div className="flex flex-col gap-3">
        {PRODUCTS.map((prod, index) => (
          <motion.button
            key={prod.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelect(prod.id)}
            className="group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="min-w-10 h-10 md:min-w-12 md:h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
                <prod.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </div>
              <span className="font-bold text-neutral-800 text-base md:text-lg group-hover:text-black leading-tight">
                {prod.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0 ml-4" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
