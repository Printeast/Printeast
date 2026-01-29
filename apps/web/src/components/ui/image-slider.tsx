import * as React from "react";
import { useState, useEffect, forwardRef } from "react";
import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Optimized motion component
const MotionImage = motion.create(NextImage);

interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> {
    images: string[];
    interval?: number;
}

const ImageSlider = forwardRef<HTMLDivElement, ImageSliderProps>(
    ({ images, interval = 5000, className, ...props }, ref) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            if (images.length <= 1) return;
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, interval);
            return () => clearInterval(timer);
        }, [images, interval]);

        return (
            <div
                ref={ref}
                className={cn(
                    "relative w-full h-full overflow-hidden bg-black",
                    className
                )}
                {...props}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {images[currentIndex] && (
                        <MotionImage
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`Auth Visual ${currentIndex + 1}`}
                            fill
                            priority
                            unoptimized
                            sizes="(max-width: 1024px) 0vw, 50vw"
                            style={{ objectFit: 'cover' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                    )}
                </AnimatePresence>

                {/* Printeast Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(226,62,131,0.2)_0%,rgba(255,122,57,0.2)_100%)] pointer-events-none mix-blend-overlay" />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                currentIndex === index
                                    ? "bg-[#E23E83] w-8"
                                    : "bg-white/40 hover:bg-white/80"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }
);

ImageSlider.displayName = "ImageSlider";

export { ImageSlider };
