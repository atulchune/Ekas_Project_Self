"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { getProductBySlugClient } from "@/lib/api/catalogClient";
import { mapDetailToViewModel, ProductDetailVM } from "@/lib/mappers/product";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";

export function FavoritesSheet() {
    const { isOpen, closeFavorites, favorites, toggleFavorite } = useFavorites();
    const { addItem } = useCart();
    const [favoriteProducts, setFavoriteProducts] = useState<ProductDetailVM[]>([]);

    useEffect(() => {
        if (favorites.length === 0) {
            setFavoriteProducts([]);
            return;
        }
        let cancelled = false;
        Promise.all(
            favorites.map((slug) =>
                getProductBySlugClient(slug).then(mapDetailToViewModel).catch(() => null)
            )
        ).then((results) => {
            if (!cancelled) {
                setFavoriteProducts(results.filter((p): p is ProductDetailVM => p !== null));
            }
        });
        return () => { cancelled = true; };
    }, [favorites]);

    // Prevent body scroll when favorites is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeFavorites}
            />

            {/* Sheet */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#F9F6F0] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-[#2D5C35]/10",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-xl font-bold font-serif text-[#1F2937]">Your Favorites</h2>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{favorites.length}</span>
                    </div>
                    <button
                        onClick={closeFavorites}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Favorite Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {favoriteProducts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Your wishlist is empty</h3>
                            <button onClick={closeFavorites} className="text-[#2D5C35] font-bold text-sm hover:underline">
                                Explore Products
                            </button>
                        </div>
                    ) : (
                        favoriteProducts.map((product) => {
                            const variant = product.variants.find(v => v.isDefault) ?? product.variants[0];
                            return (
                                <div key={product.slug} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group hover:border-red-500/30 transition-colors">
                                    <Link href={`/product/${product.slug}`} onClick={closeFavorites} className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                        {product.gallery[0] ? (
                                            <Image src={product.gallery[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag className="w-6 h-6" /></div>
                                        )}
                                    </Link>

                                    <div className="flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <Link href={`/product/${product.slug}`} onClick={closeFavorites} className="font-bold text-sm text-[#1F2937] hover:text-[#2D5C35] transition-colors line-clamp-2 pr-6">
                                                {product.name}
                                            </Link>
                                            <button
                                                onClick={() => toggleFavorite(product.slug)}
                                                className="text-gray-300 hover:text-red-500 transition-colors absolute top-4 right-4"
                                                title="Remove from favorites"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {variant && (
                                            <>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{variant.label}</p>
                                                <div className="font-bold text-[#1F2937] mb-3">₹{variant.price}</div>
                                                <button
                                                    onClick={() => addItem(variant.id, 1)}
                                                    disabled={!variant.inStock}
                                                    className="mt-auto w-full bg-[#17301A] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#2D5C35] transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" /> {variant.inStock ? "Add to Cart" : "Sold Out"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}
