"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Check, Star, X, ShoppingBag, Eye, Heart, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";
import { getCategoriesClient, getProductsClient } from "@/lib/api/catalogClient";
import { BackendCategory } from "@/lib/api/types";
import { mapListItemToCard, ProductCardVM } from "@/lib/mappers/product";

const SORT_OPTIONS = [
    { label: "Newest", value: "-created_at" },
    { label: "Top Rated", value: "-average_rating" },
    { label: "Name A-Z", value: "name" },
];

function ShopContent() {
    const { addItem } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category");

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [categories, setCategories] = useState<BackendCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [maxPrice, setMaxPrice] = useState<number>(899);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);

    const [products, setProducts] = useState<ProductCardVM[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [quickViewProduct, setQuickViewProduct] = useState<ProductCardVM | null>(null);

    useEffect(() => {
        getCategoriesClient().then(setCategories).catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            getProductsClient({
                search: searchQuery || undefined,
                category: selectedCategory ?? undefined,
                max_price: maxPrice < 899 ? maxPrice : undefined,
                in_stock: inStockOnly || undefined,
                ordering: sort,
                page_size: 48,
            })
                .then((res) => setProducts(res.results.map(mapListItemToCard)))
                .catch(() => setProducts([]))
                .finally(() => setIsLoading(false));
        }, 250);
        return () => clearTimeout(timeout);
    }, [searchQuery, selectedCategory, maxPrice, inStockOnly, sort]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setMaxPrice(899);
        setInStockOnly(false);
    };

    const filteredProducts = useMemo(() => products, [products]);

    return (
        <div className="min-h-screen bg-[#F4F1EA] pt-24 pb-20 font-sans">
            <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* LEFT SIDEBAR */}
                    <aside className="w-full lg:w-[280px] shrink-0 sticky top-28 bg-[#FCFAF6] rounded-2xl p-6 border border-gray-200/60 shadow-sm">
                        {/* Refine Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Refine</h3>
                            <button onClick={clearFilters} className="text-[10px] font-bold text-[#2D5C35] uppercase tracking-widest border-b border-[#2D5C35]">Clear all</button>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-8">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D5C35] transition-colors"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Category</h4>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                                                className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                    selectedCategory === cat.slug ? "bg-[#2D5C35] border-[#2D5C35]" : "bg-white border-gray-300 group-hover:border-[#2D5C35]"
                                                )}>
                                                {selectedCategory === cat.slug && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span
                                                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                                                className="text-[13px] text-gray-600 font-medium group-hover:text-[#1F2937] transition-colors"
                                            >
                                                {cat.name}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-gray-400">{cat.product_count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Max Price Slider */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Price</h4>
                                <span className="text-[11px] font-bold text-[#1F2937]">₹{maxPrice}+</span>
                            </div>
                            <input
                                type="range"
                                min="199" max="899"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full accent-[#2D5C35] h-1 bg-gray-200 rounded-full appearance-none outline-none"
                            />
                            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                                <span>₹199</span>
                                <span>₹899+</span>
                            </div>
                        </div>

                        {/* In Stock Toggle */}
                        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-8">
                            <span className="text-[13px] font-medium text-gray-600">In stock only</span>
                            <button
                                onClick={() => setInStockOnly(!inStockOnly)}
                                className={cn(
                                    "w-10 h-5 rounded-full relative transition-colors",
                                    inStockOnly ? "bg-[#2D5C35]" : "bg-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                                    inStockOnly ? "translate-x-5" : "translate-x-0"
                                )}></div>
                            </button>
                        </div>

                        {/* Guide Banner */}
                        <div className="bg-[#FAF8F3] border border-[#8C6D3F]/20 rounded-xl p-5">
                            <h5 className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-2">Not Sure Which?</h5>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">Sesame for everyday tempering, coconut for South Indian cooking, mustard for pickles and Bengali fish.</p>
                        </div>
                    </aside>

                    {/* MAIN CONTENT GRID */}
                    <div className="flex-1">

                        {/* Top Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-[13px] font-medium text-gray-500"><strong className="text-[#1F2937] font-bold">{filteredProducts.length}</strong> products</div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort</span>
                                <div className="relative">
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-10 text-[13px] font-bold text-[#1F2937] focus:outline-none focus:border-[#2D5C35] cursor-pointer shadow-sm"
                                    >
                                        {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-20 text-gray-400">Loading products…</div>
                        ) : (
                            <>
                                {/* Product Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                    {filteredProducts.map(product => {
                                        const discount = product.originalPrice && product.price
                                            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                            : 0;

                                        return (
                                            <div key={product.id} className="group flex flex-col relative">

                                                {/* Image Container */}
                                                <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] w-full bg-[#EAE5D9] rounded-2xl overflow-hidden mb-5">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">No image</div>
                                                    )}

                                                    {/* Badges */}
                                                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                        {product.badge && <span className="bg-[#17301A] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{product.badge}</span>}
                                                    </div>
                                                    {discount > 0 && (
                                                        <div className="absolute top-3 right-3 z-10">
                                                            <span className="bg-[#B08955] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{discount}% off</span>
                                                        </div>
                                                    )}

                                                    {/* Action Icons Container */}
                                                    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); setQuickViewProduct(product); }}
                                                            className="bg-white/95 backdrop-blur p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-[#17301A]"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={(e) => { e.preventDefault(); toggleFavorite(product.slug); }}
                                                            className="bg-white p-2.5 rounded-full shadow-md hover:scale-105 transition-all text-gray-400 hover:text-red-500"
                                                        >
                                                            <Heart className={cn("w-4 h-4", isFavorite(product.slug) && "fill-red-500 text-red-500")} />
                                                        </button>
                                                    </div>
                                                </Link>

                                                {/* Product Details */}
                                                <div className="flex justify-between items-start mb-1 text-[8px] font-bold uppercase tracking-widest text-gray-400">
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <Star className="w-2.5 h-2.5 fill-[#D9A528] text-[#D9A528]" />
                                                        <span className="text-gray-800">{product.rating.toFixed(1)}</span>
                                                    </div>
                                                    <span>{product.defaultVariantLabel}</span>
                                                </div>

                                                <Link href={`/product/${product.slug}`} className="block">
                                                    <h3 className="font-serif text-[15px] font-bold text-[#1F2937] mb-1 group-hover:text-[#2D5C35] transition-colors line-clamp-1">{product.name}</h3>
                                                    <p className="text-[11px] text-gray-500 mb-3 h-4 line-clamp-1 leading-relaxed truncate">{product.shortDescription}</p>
                                                </Link>

                                                <div className="flex items-center gap-1.5 mb-4">
                                                    <span className="text-base font-bold text-[#1F2937]">{product.price !== null ? `₹${product.price}` : "—"}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 mt-auto">
                                                    <button
                                                        onClick={() => product.defaultVariantId && addItem(product.defaultVariantId, 1)}
                                                        disabled={!product.defaultVariantId || !product.inStock}
                                                        className="flex-1 bg-[#17301A] hover:bg-[#2D5C35] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        {product.inStock ? "ADD TO CART" : "SOLD OUT"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {filteredProducts.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-gray-500 font-medium">No products found matching your filters.</p>
                                        <button onClick={clearFilters} className="mt-4 text-[#2D5C35] font-bold text-sm hover:underline">Clear Filters</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* QUICK VIEW MODAL */}
            {quickViewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setQuickViewProduct(null)}>
                    <div className="absolute inset-0 bg-[#17301A]/60 backdrop-blur-sm transition-opacity" />

                    <div
                        className="bg-[#FCFAF6] rounded-2xl w-full max-w-3xl shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden max-h-[85vh] animate-fade-in-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setQuickViewProduct(null)}
                            className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Left: Image */}
                        <div className="w-full md:w-[45%] relative bg-[#EAE5D9] aspect-[4/3] md:aspect-auto flex-shrink-0">
                            {quickViewProduct.image ? (
                                <Image src={quickViewProduct.image} alt={quickViewProduct.name} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300"><ShoppingBag className="w-10 h-10" /></div>
                            )}
                        </div>

                        {/* Right: Content */}
                        <div className="w-full md:w-[55%] p-5 md:p-6 lg:p-8 flex flex-col justify-center">

                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
                                    <Star className="w-3 h-3 fill-[#D9A528] text-[#D9A528]" />
                                    <span className="text-[#1F2937]">{quickViewProduct.rating.toFixed(1)}</span>
                                    <span>({quickViewProduct.reviewCount})</span>
                                </div>
                                {quickViewProduct.defaultVariantLabel && (
                                    <span className="bg-[#17301A] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{quickViewProduct.defaultVariantLabel}</span>
                                )}
                            </div>

                            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1F2937] mb-2 leading-tight">{quickViewProduct.name}</h2>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{quickViewProduct.shortDescription}</p>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl font-black text-[#1F2937]">{quickViewProduct.price !== null ? `₹${quickViewProduct.price}` : "—"}</span>
                                {quickViewProduct.originalPrice && (
                                    <span className="text-xs text-gray-400 line-through">₹{quickViewProduct.originalPrice}</span>
                                )}
                                {quickViewProduct.originalPrice && quickViewProduct.price !== null && (
                                    <span className="bg-[#D9A528] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                        SAVE {Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}%
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (quickViewProduct.defaultVariantId) {
                                            addItem(quickViewProduct.defaultVariantId, 1);
                                        }
                                        setQuickViewProduct(null);
                                    }}
                                    disabled={!quickViewProduct.defaultVariantId || !quickViewProduct.inStock}
                                    className="flex-1 bg-[#17301A] hover:bg-[#2D5C35] text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-colors shadow-sm disabled:opacity-40"
                                >
                                    {quickViewProduct.inStock ? "ADD TO CART" : "SOLD OUT"}
                                </button>
                                <Link
                                    href={`/product/${quickViewProduct.slug}`}
                                    className="px-4 border border-gray-300 hover:border-[#1F2937] text-gray-700 text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    DETAILS
                                </Link>
                                <button
                                    onClick={() => toggleFavorite(quickViewProduct.slug)}
                                    className="w-10 shrink-0 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-200 transition-colors group"
                                >
                                    <Heart className={cn("w-4 h-4 transition-colors", isFavorite(quickViewProduct.slug) ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500")} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F4F1EA] text-[#2D5C35]">Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
