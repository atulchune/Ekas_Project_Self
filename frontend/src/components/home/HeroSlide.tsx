"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCardVM } from "@/lib/mappers/product";

interface HeroSlideProps {
    product: ProductCardVM;
    isActive: boolean;
}

// Curated color themes keyed by slug — decorative art direction, not product data.
const getProductTheme = (product: ProductCardVM) => {
    const slug = product.slug;

    if (slug.includes("ghee")) {
        return {
            bg: "from-[#1a1205] to-[#2b1f0c]",
            accent: "bg-[#D9A528]",
            textAccent: "text-[#D9A528]",
            glow: "bg-[#D9A528]/10",
            button: "bg-[#D9A528] hover:bg-[#b88c22] text-[#1a1205]",
            textMain: "text-[#FDF0D5]",
            image: "/images/ghee_3d_render.png"
        };
    }
    if (slug.includes("coconut")) {
        return {
            bg: "from-[#081216] to-[#0a1b24]",
            accent: "bg-[#38bdf8]",
            textAccent: "text-[#38bdf8]",
            glow: "bg-[#38bdf8]/10",
            button: "bg-[#38bdf8] hover:bg-[#0284c7] text-[#081216]",
            textMain: "text-[#e0f2fe]",
            image: "/images/coconut_3d_render.png"
        };
    }
    if (slug.includes("mustard")) {
        return {
            bg: "from-[#1a1403] to-[#241a05]",
            accent: "bg-[#facc15]",
            textAccent: "text-[#facc15]",
            glow: "bg-[#facc15]/10",
            button: "bg-[#facc15] hover:bg-[#ca8a04] text-[#1a1403]",
            textMain: "text-[#fef08a]",
            image: "/images/mustard_3d_render.png"
        };
    }
    if (slug.includes("sesame")) {
        return {
            bg: "from-[#110c08] to-[#1c140c]",
            accent: "bg-[#fdba74]",
            textAccent: "text-[#fdba74]",
            glow: "bg-[#fdba74]/10",
            button: "bg-[#fb923c] hover:bg-[#ea580c] text-[#110c08]",
            textMain: "text-[#ffedd5]",
            image: "/images/sesame_3d_render.png"
        };
    }
    if (slug.includes("almond")) {
        return {
            bg: "from-[#150a16] to-[#251027]",
            accent: "bg-[#c084fc]",
            textAccent: "text-[#c084fc]",
            glow: "bg-[#c084fc]/10",
            button: "bg-[#c084fc] hover:bg-[#9333ea] text-[#150a16]",
            textMain: "text-[#faf5ff]",
            image: "/images/almond_3d_render.png"
        };
    }
    if (slug.includes("groundnut")) {
        return {
            bg: "from-[#11160d] to-[#1c2415]",
            accent: "bg-[#4ade80]",
            textAccent: "text-[#4ade80]",
            glow: "bg-[#4ade80]/10",
            button: "bg-[#4ade80] hover:bg-[#22c55e] text-[#11160d]",
            textMain: "text-[#f0fdf4]",
            image: "/images/groundnut_3d_render.png"
        };
    }
    if (slug.includes("honey")) {
        return {
            bg: "from-[#1a1002] to-[#2b1a04]",
            accent: "bg-[#f0a500]",
            textAccent: "text-[#f0a500]",
            glow: "bg-[#f0a500]/10",
            button: "bg-[#f0a500] hover:bg-[#c98600] text-[#1a1002]",
            textMain: "text-[#fff3d6]",
            image: product.image
        };
    }

    // Default / unmatched (e.g. sunflower) — earthy green, real product photo.
    return {
        bg: "from-[#11160d] to-[#1c2415]",
        accent: "bg-[#4ade80]",
        textAccent: "text-[#4ade80]",
        glow: "bg-[#4ade80]/10",
        button: "bg-[#4ade80] hover:bg-[#22c55e] text-[#11160d]",
        textMain: "text-[#f0fdf4]",
        image: product.image
    };
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export function HeroSlide({ product, isActive }: HeroSlideProps) {
    const theme = getProductTheme(product);

    return (
        <div className={cn(
            "absolute inset-0 w-full h-full flex flex-col justify-center overflow-hidden bg-gradient-to-b",
            theme.bg
        )}>
            {/* Subtle background glow behind the product */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className={cn("w-[70vw] max-w-[800px] aspect-square rounded-full blur-[120px]", theme.glow)}
                />
            </div>

            {/* Main Content Container - 100vh fit */}
            <div className="w-full h-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col pt-24 pb-8 lg:pt-28">

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isActive ? "visible" : "hidden"}
                    exit="exit"
                    className="flex-1 flex flex-col items-center justify-between"
                >
                    {/* TOP: Large Centered Typography */}
                    <div className="w-full text-center mt-4 lg:mt-8 flex flex-col items-center max-w-4xl mx-auto">
                        <motion.h2
                            variants={itemVariants}
                            className={cn("text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[1.05] font-serif tracking-tight", theme.textMain)}
                        >
                            {product.name}
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="mt-6 text-base sm:text-lg lg:text-xl text-white/60 font-light max-w-2xl text-center"
                        >
                            {product.shortDescription}
                        </motion.p>
                    </div>

                    {/* MIDDLE: Product & Side Floating Elements */}
                    <div className="relative w-full flex-1 flex items-center justify-center my-8 lg:my-0 min-h-[300px]">

                        {/* Left Floating Text */}
                        <motion.div
                            variants={itemVariants}
                            className="absolute left-4 lg:left-20 xl:left-32 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center text-center max-w-[180px]"
                        >
                            <Sparkles className={cn("w-10 h-10 mb-4", theme.textAccent)} strokeWidth={1.5} />
                            <p className={cn("font-serif text-lg leading-tight", theme.textMain)}>
                                Gentle Formulas Made To Hydrate, Protect, And Nourish.
                            </p>
                            {/* Thin elegant line connecting to center */}
                            <div className="absolute top-1/2 -right-32 w-24 h-[1px] bg-white/20 hidden lg:block" />
                        </motion.div>

                        {/* Center Product Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={isActive ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.3 }}
                            className="relative w-full h-[45vh] lg:h-[55vh] max-h-[700px] z-20"
                        >
                            {theme.image ? (
                                <Image
                                    src={theme.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
                                    priority
                                    sizes="(max-width: 1024px) 80vw, 500px"
                                />
                            ) : null}
                        </motion.div>

                        {/* Right Floating Text */}
                        <motion.div
                            variants={itemVariants}
                            className="absolute right-4 lg:right-20 xl:right-32 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center text-center max-w-[180px]"
                        >
                            <Droplets className={cn("w-10 h-10 mb-4", theme.textAccent)} strokeWidth={1.5} />
                            <p className={cn("font-serif text-lg leading-tight", theme.textMain)}>
                                Pure Care In Every Drop. 100% Natural.
                            </p>
                            {/* Thin elegant line connecting to center */}
                            <div className="absolute top-1/2 -left-32 w-24 h-[1px] bg-white/20 hidden lg:block" />
                        </motion.div>

                    </div>

                    {/* BOTTOM: CTA Button */}
                    <motion.div variants={itemVariants} className="mb-4 lg:mb-12 z-30">
                        <Link
                            href={`/product/${product.slug}`}
                            className={cn(
                                "group flex items-center justify-center gap-3 px-8 py-4 font-bold text-sm uppercase tracking-wider rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1",
                                theme.button
                            )}
                        >
                            Explore Collection
                            <span className="bg-black/20 p-1.5 rounded-full">
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </motion.div>

                </motion.div>

                {/* Decorative Bottom Lines (optional to frame it) */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}
