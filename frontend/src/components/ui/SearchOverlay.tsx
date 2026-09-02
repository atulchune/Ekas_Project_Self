"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

import { createPortal } from "react-dom";

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Handle initial focus and no scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Search Logic
    const results = debouncedQuery.trim() === ""
        ? []
        : PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(debouncedQuery.toLowerCase())
        ).slice(0, 6); // Limit results for clean layout

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debouncedQuery.trim()) {
            onClose();
            router.push(`/shop?search=${encodeURIComponent(debouncedQuery)}`);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 md:pt-32 px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-2xl bg-[#FDFAF5] rounded-[2rem] shadow-2xl border border-[#2D5C35]/10 overflow-hidden flex flex-col max-h-[70vh] z-[10000]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header / Input */}
                        <div className="relative border-b border-gray-100 bg-white p-2">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                                <Search className="absolute left-6 w-6 h-6 text-[#D9A528]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full pl-16 pr-14 py-5 text-xl font-serif text-[#1F2937] bg-transparent outline-none placeholder:text-gray-300 placeholder:font-sans"
                                />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Results / Empty State */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                            {debouncedQuery === "" ? (
                                <div className="p-8 text-center">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Suggested Searches</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {["Cold Pressed Oil", "Groundnut Oil", "Sesame", "A2 Ghee"].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    setQuery(tag);
                                                    inputRef.current?.focus();
                                                }}
                                                className="px-4 py-2 bg-white border border-gray-100 rounded-full text-sm text-gray-600 hover:border-[#2D5C35] hover:text-[#2D5C35] transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="py-2 px-2 space-y-1">
                                    <h3 className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Products
                                    </h3>
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-4 p-3 hover:bg-white rounded-2xl transition-all group border border-transparent hover:border-gray-100 hover:shadow-sm"
                                        >
                                            <div className="w-14 h-14 bg-[#F9F7F2] rounded-xl relative overflow-hidden shrink-0 border border-gray-100">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-[#1F2937] font-serif group-hover:text-[#2D5C35] transition-colors truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">{product.description}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D5C35] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-400">
                                    <p>No results found for "{debouncedQuery}"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Hint */}
                        {debouncedQuery !== "" && (
                            <div className="bg-[#F9F7F2] px-6 py-3 border-t border-[#2D5C35]/5 flex items-center justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                                <span>Press <strong>Enter</strong> to search all</span>
                                <span className="flex items-center gap-1">
                                    <ShoppingBag className="w-3 h-3" /> View All Results
                                </span>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
