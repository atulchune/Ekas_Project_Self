"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

// Get the hover 3D image based on product ID
const getHoverImage = (id: string) => {
    const map: Record<string, string> = {
        p1: "/images/groundnut_3d_render.png",
        p2: "/images/ghee_3d_render.png",
        p3: "/images/coconut_3d_render.png",
        p4: "/images/mustard_3d_render.png",
        p5: "/images/sesame_3d_render.png",
        p6: "/images/almond_3d_render.png",
    };
    return map[id] || "/images/hero_3d.png";
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
    const [selectedSizeIndex] = useState(0);
    const { addItem } = useCart();
    const activeSize = product.sizes[selectedSizeIndex];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, activeSize.label, activeSize.price);
    };

    return (
        <div className="group bg-white flex flex-col h-full relative overflow-hidden border border-gray-200 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1.5">
            {/* Image Container */}
            <div className="relative w-full aspect-[1/1] bg-white cursor-pointer p-0 overflow-hidden">
                {/* Badges Overlay */}
                <div className="absolute top-0 left-0 z-20">
                    <div className="bg-[#0f5c4a] text-white text-[11px] font-bold px-2 py-2.5 rounded-br-2xl flex flex-col items-center leading-tight shadow-sm">
                        <span>19%</span>
                        <span>OFF</span>
                    </div>
                </div>
                {product.badge && (
                    <div className="absolute top-0 right-0 z-20">
                        <div className="bg-[#D9A528] text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                            {product.badge}
                        </div>
                    </div>
                )}

                {/* Initial Image (3D Render / Details) */}
                <Image
                    src={getHoverImage(product.id)}
                    alt={`${product.name} 3D`}
                    fill
                    className="object-cover transition-all duration-700 ease-in-out opacity-100 group-hover:opacity-0 group-hover:scale-110"
                />

                {/* Hover Image (White BG Bottle) */}
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain bg-white transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 scale-95"
                />

                {/* Dynamic Badge */}
                <div className="absolute bottom-3 left-3 z-20 bg-[#C8F0FA] text-[#0A4B5A] text-[12px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    {["Selling Fast", "Best Seller", "Popular", "Trending", "Top Rated"][index % 5]}
                </div>
            </div>

            {/* Floating ADD Button */}
            <div className="flex justify-end mt-[-24px] px-3 relative z-30">
                <button
                    onClick={handleAddToCart}
                    className="bg-[#225744] text-white text-[14px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#17301A] transition-colors shadow-lg"
                >
                    ADD
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow bg-white relative z-10 pt-1">
                <Link href={`/product/${product.slug}`} className="mb-2 flex-grow">
                    <h3 className="text-[16px] font-serif font-medium text-[#1F2937] leading-snug group-hover:text-[#2D5C35] transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                    <span className="text-[13px] font-bold text-gray-800">{product.rating}</span>
                    <span className="text-[13px] text-gray-500">({product.reviews} reviews)</span>
                </div>

                <div className="mt-auto flex items-end justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] text-gray-400 line-through font-medium">
                            ₹{Math.round(Number(String(activeSize.price).replace(/,/g, '')) * 1.19)}
                        </span>
                        <span className="text-xl font-bold text-black tracking-tight">₹{activeSize.price}</span>
                    </div>
                </div>

                {/* Save Tag */}
                <div className="bg-[#E6F4EA] border border-[#C5E1CE] text-[#1E7145] text-[11px] font-medium px-2 py-1 rounded flex items-center gap-1.5 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a2 2 0 0 1-2.83 0l-5.66-5.66a2 2 0 0 1 0-2.83l9.19-9.19a2 2 0 0 1 1.41-.58h6.16a2 2 0 0 1 2 2v6.16a2 2 0 0 1-.58 1.41z" /><line x1="15.5" y1="8.5" x2="15.51" y2="8.5" /></svg>
                    <strong>Save ₹{Math.round(Number(String(activeSize.price).replace(/,/g, '')) * 0.19)}</strong> – no other discounts
                </div>
            </div>
        </div>
    );
}
