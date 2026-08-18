"use client";

import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const OFFERS = [
    {
        id: "summer-sale",
        title: "Summer Flash Sale!",
        description: "Get Flat 20% OFF on all Cold Pressed Oils. Limited time offer.",
        code: "SUMMER20",
        expires: "2024-05-01T00:00:00",
        color: "bg-[#2D5C35]",
        textColor: "text-white"
    },
    {
        id: "combo-pack",
        title: "Combo Savings",
        description: "Buy Groundnut + Sesame Oil Combo & Save ₹150 + Free Shipping.",
        code: "COMBO150",
        expires: "2024-06-01T00:00:00",
        color: "bg-[#D9A528]",
        textColor: "text-[#1F2937]"
    },
    {
        id: "new-user",
        title: "New User Offer",
        description: "First time here? Use code WELCOME10 for 10% instant discount.",
        code: "WELCOME10",
        expires: "2030-01-01T00:00:00",
        color: "bg-[#1F2937]",
        textColor: "text-white"
    }
];

export function OffersSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Auto-rotate offers every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % OFFERS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const currentOffer = OFFERS[currentIndex];

    return (
        <section className="relative z-40 -mt-8 mb-12 px-4 container mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
                {/* Background Animation */}
                <motion.div
                    key={currentOffer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-colors duration-500",
                        currentOffer.color
                    )}
                />

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />


                <div className="relative flex flex-col md:flex-row items-center justify-between p-6 md:px-12 md:py-8 gap-6 text-center md:text-left">

                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 flex-1 justify-center md:justify-start">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                            currentOffer.textColor === "text-white" ? "bg-white/20 text-white" : "bg-white text-[#2D5C35]"
                        )}>
                            <Tag className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <motion.h3
                                key={`title-${currentIndex}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                className={cn("text-2xl md:text-3xl font-bold font-serif leading-tight", currentOffer.textColor)}
                            >
                                {currentOffer.title}
                            </motion.h3>
                            <motion.p
                                key={`desc-${currentIndex}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className={cn("text-sm md:text-base opacity-90 font-medium", currentOffer.textColor)}
                            >
                                {currentOffer.description}
                            </motion.p>
                        </div>
                    </div>

                    {/* Code & CTA */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                        {/* Coupon Code Box */}
                        <div className={cn(
                            "flex flex-col items-center px-6 py-2 rounded-xl border-2 border-dashed",
                            currentOffer.textColor === "text-white" ? "border-white/40 bg-white/10" : "border-[#1F2937]/20 bg-[#1F2937]/5"
                        )}>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest opacity-70", currentOffer.textColor)}>Use Code</span>
                            <span className={cn("text-xl font-mono font-bold tracking-wider", currentOffer.textColor)}>{currentOffer.code}</span>
                        </div>

                        <Link
                            href="/shop"
                            className={cn(
                                "px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group",
                                currentOffer.textColor === "text-white" ? "bg-white text-[#2D5C35]" : "bg-[#2D5C35] text-white"
                            )}
                        >
                            Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {OFFERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                idx === currentIndex
                                    ? (currentOffer.textColor === "text-white" ? "bg-white w-6" : "bg-[#1F2937] w-6")
                                    : (currentOffer.textColor === "text-white" ? "bg-white/30 hover:bg-white/50" : "bg-[#1F2937]/20 hover:bg-[#1F2937]/40")
                            )}
                        />
                    ))}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className={cn(
                        "absolute top-2 right-2 p-2 rounded-full transition-colors opacity-60 hover:opacity-100",
                        currentOffer.textColor === "text-white" ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-black"
                    )}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
