"use client";

import { useState, useEffect, useCallback } from "react";
import { HeroSlide } from "./HeroSlide";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OilFluid from "@/components/ui/OilFluid";
import { ProductCardVM } from "@/lib/mappers/product";

const AUTOPLAY_DELAY = 4000;

export function Hero({ products }: { products: ProductCardVM[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const heroProducts = products;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, [heroProducts.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    }, [heroProducts.length]);

    // Autoplay logic
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            nextSlide();
        }, AUTOPLAY_DELAY);

        return () => clearInterval(timer);
    }, [nextSlide, isHovered]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextSlide, prevSlide]);

    if (!heroProducts.length) return null;

    return (
        <section 
            // h-screen ensures it takes exactly 100vh with no white space below or above
            className="relative w-full h-screen bg-black overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-roledescription="carousel"
        >
            <OilFluid palette={['#000000']} />
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 w-full h-full"
                >
                    <HeroSlide 
                        product={heroProducts[currentIndex]} 
                        isActive={true} 
                    />
                </motion.div>
            </AnimatePresence>

            {/* Top gradient to make navbar text readable against dark backgrounds */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />

            {/* Mobile/Touch swipe overlay - simple implementation covering the whole screen */}
            <div 
                className="absolute inset-0 z-30 touch-pan-y"
                onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const startX = touch.clientX;
                    
                    const handleTouchEnd = (e: TouchEvent) => {
                        const touch = e.changedTouches[0];
                        const endX = touch.clientX;
                        const diff = startX - endX;
                        
                        // Swipe threshold
                        if (Math.abs(diff) > 50) {
                            if (diff > 0) nextSlide();
                            else prevSlide();
                        }
                        
                        document.removeEventListener('touchend', handleTouchEnd);
                    };
                    
                    document.addEventListener('touchend', handleTouchEnd);
                }}
            />
            
            {/* Slider navigation buttons in the bottom right corner */}
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-40 flex items-center gap-3">
                <button 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-lg transition-all"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-lg transition-all"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
            
            {/* Elegant minimal dot indicators at the very bottom center (optional, but good for UX) */}
            <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center gap-2 pointer-events-none opacity-50">
                {heroProducts.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                    />
                ))}
            </div>
        </section>
    );
}
