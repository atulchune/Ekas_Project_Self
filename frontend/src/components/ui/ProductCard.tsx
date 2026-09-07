"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

// Removed hardcoded getHoverImage mapping
export function ProductCard({ product, index = 0, onQuickView }: { product: Product; index?: number; onQuickView?: () => void }) {
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const { addItem } = useCart();
    const activeSize = product.sizes[selectedSizeIndex];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, activeSize.label, activeSize.price);
    };

    return (
        <div className="group bg-white flex flex-col h-full border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative w-full aspect-square bg-gradient-to-b from-[#F2EDDF] to-[#E3D4BE] cursor-pointer overflow-hidden block">
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white text-[#17301A] text-[9px] font-bold px-2.5 py-1 rounded-[2px] uppercase tracking-widest shadow-sm">
                        {["BEST SELLER", "NEW", "TOP RATED", "POPULAR", "LIMITED"][index % 5]}
                    </div>
                </div>

                {/* Hover Actions (Eye & Heart) */}
                <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={(e) => { e.preventDefault(); if (onQuickView) onQuickView(); }} 
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-[#17301A] hover:scale-110 transition-all"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => e.preventDefault()} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-red-500 hover:scale-110 transition-all">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Initial Image (Hero Image) */}
                <Image
                    src={product.image}
                    alt={`${product.name}`}
                    fill
                    className="object-contain p-4 transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                />

                {/* Hover Image (Lab Tested / Secondary) */}
                <Image
                    src={product.images?.gallery?.[1] || product.gallery?.[1] || product.image}
                    alt={`${product.name} Details`}
                    fill
                    className="object-contain p-4 transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                />
            </Link>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow bg-white text-center">
                <Link href={`/product/${product.slug}`} className="mb-2">
                    <h3 className="text-[17px] md:text-[19px] font-serif text-[#17301A] leading-snug group-hover:text-[#2D5C35] transition-colors line-clamp-2 px-2">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-[12px] text-gray-500 leading-relaxed mb-4 line-clamp-2 px-1">
                    {product.description}
                </p>

                <div className="mt-auto flex flex-col">
                    {/* Size Options */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                        {product.sizes.map((size, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); setSelectedSizeIndex(i); }}
                                className={cn(
                                    "text-[10px] font-bold px-3 py-1 rounded-[3px] border transition-colors",
                                    selectedSizeIndex === i
                                        ? "bg-[#17301A] text-white border-[#17301A]"
                                        : "bg-white text-[#8C6D3F] border-[#8C6D3F]/40 hover:border-[#8C6D3F]"
                                )}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[15px] font-bold text-[#1F2937]">₹{activeSize.price}</span>
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#17301A] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-[4px] hover:bg-[#204024] transition-colors"
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
