"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/products";

// Select 5 products to fit in the 5-column grid perfectly
const featuredProducts = PRODUCTS.slice(0, 5);

export function FeaturedProducts() {
    return (
        <section className="py-16 bg-[#F4F1EA]">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div className="max-w-2xl space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] font-serif">Featured Products</h2>
                        <div className="h-1 w-16 bg-[#D9A528] rounded-full" />
                    </div>
                    <Link 
                        href="/shop" 
                        className="hidden md:inline-flex items-center gap-3 px-8 py-3 rounded-full border border-[#2D5C35]/40 text-[#2D5C35] text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#2D5C35] hover:text-white transition-all"
                    >
                        View All <span>&rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                    {featuredProducts.map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
