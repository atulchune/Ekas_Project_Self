"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowLeft, ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 9;

export default function BlogsPage() {
    const [selectedCategory, setSelectedCategory] = useState<"All" | "Recipes" | "Health Benefits" | "General">("All");
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ["All", "Recipes", "Health Benefits", "General"];

    const allFilteredPosts = selectedCategory === "All"
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === selectedCategory);

    const totalPages = Math.ceil(allFilteredPosts.length / POSTS_PER_PAGE);

    // Pagination slicing
    const displayPosts = allFilteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleCategoryChange = (cat: any) => {
        setSelectedCategory(cat);
        setCurrentPage(1); // Reset to first page
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] pt-24 pb-20">
            {/* Header */}
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 mb-12 text-center">
                <span className="text-[#D9A528] font-bold tracking-[0.2em] uppercase text-xs mb-3 block animate-fade-in">Our Blog</span>
                <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#1F2937] mb-4">Latest Stories & Recipes</h1>
                <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
                    Expert insights on health, traditional cooking, and wood-pressed oils.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 border",
                                selectedCategory === cat
                                    ? "bg-[#2D5C35] text-white border-[#2D5C35] shadow-md"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-[#FDFAF5] hover:border-[#2D5C35] hover:text-[#2D5C35]"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blogs List Layout */}
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
                <div className="space-y-6">
                    {displayPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-[#2D5C35]/5 hover:shadow-lg hover:border-[#2D5C35]/20 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Image Section - Smaller width on desktop */}
                                <Link href={`/blogs/${post.slug}`} className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-[#FDFAF5]">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[#2D5C35] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                        {post.category}
                                    </div>
                                </Link>

                                {/* Content Section */}
                                <div className="p-6 md:p-8 flex flex-col flex-1 justify-center">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#D9A528] mb-2 uppercase tracking-wider">
                                        <Calendar className="w-3 h-3" />
                                        {post.date}
                                    </div>
                                    <Link href={`/blogs/${post.slug}`} className="block mb-3">
                                        <h3 className="text-xl md:text-2xl font-bold font-serif text-[#1F2937] leading-tight group-hover:text-[#2D5C35] transition-colors">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto">
                                        <Link
                                            href={`/blogs/${post.slug}`}
                                            className="inline-flex items-center text-[#2D5C35] text-xs font-bold uppercase tracking-widest hover:text-[#1F2937] transition-colors gap-1 group/link"
                                        >
                                            Read Full Article <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-[#2D5C35] hover:border-[#2D5C35] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                                    currentPage === i + 1
                                        ? "bg-[#2D5C35] text-white shadow-md"
                                        : "bg-white border border-gray-200 text-gray-500 hover:text-[#2D5C35] hover:border-[#2D5C35]"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-[#2D5C35] hover:border-[#2D5C35] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
