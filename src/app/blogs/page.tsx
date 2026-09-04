"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 5;

export default function BlogsPage() {
    const [selectedCategory, setSelectedCategory] = useState<"All" | "Recipes" | "Health Benefits" | "General">("All");
    const [currentPage, setCurrentPage] = useState(1);

    const categories = [
        { name: "All", label: "ALL" },
        { name: "Recipes", label: "RECIPES" },
        { name: "Health Benefits", label: "HEALTH BENEFITS" },
        { name: "General", label: "GENERAL" }
    ] as const;

    // Featured post (slug 'white-sesame-oil-benefits')
    const featuredPost = BLOG_POSTS.find(post => post.slug === 'white-sesame-oil-benefits') || BLOG_POSTS[0];

    // Most read (static list for UI)
    const mostReadPosts = BLOG_POSTS.slice(1, 6); // Just grab 5 posts

    const browseByOil = [
        { name: "Sesame oil", count: 12 },
        { name: "Mustard oil", count: 9 },
        { name: "Coconut oil", count: 7 },
        { name: "Groundnut oil", count: 5 },
        { name: "Ghee & butter", count: 4 },
    ];

    const filteredPosts = selectedCategory === "All"
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === selectedCategory);

    // If "All" is selected, we exclude the featured post from the list so it doesn't repeat immediately.
    // Wait, the design has a featured post at the top, then a list.
    // If filtering by a category, the featured post might disappear if it's not in that category.
    // For simplicity, we just show the featured post statically at the top of the "All" view, 
    // and filter the rest.

    const listPosts = selectedCategory === "All"
        ? filteredPosts.filter(p => p.id !== featuredPost.id)
        : filteredPosts;

    const totalPostsCount = listPosts.length;
    const totalPages = Math.ceil(totalPostsCount / POSTS_PER_PAGE);

    const displayPosts = listPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleCategoryChange = (cat: typeof selectedCategory) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const getCategoryCount = (catName: string) => {
        if (catName === "All") return BLOG_POSTS.length;
        return BLOG_POSTS.filter(post => post.category === catName).length;
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] pt-12 pb-24 font-sans text-[#1F2937]">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <span className="text-[#D9A528] text-[10px] font-bold tracking-[0.2em] uppercase block mb-3">
                            Ekas Journal
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-[#0A192F]">
                            Latest Stories & Recipes
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Expert insights on health, traditional cooking, and wood-pressed oils.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <span>{displayPosts.length} of {totalPostsCount} articles</span>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            Newest first <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <hr className="border-gray-300 mb-6" />

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryChange(cat.name as any)}
                            className={cn(
                                "flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border",
                                selectedCategory === cat.name
                                    ? "bg-[#17301A] text-white border-[#17301A]"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {cat.label}
                            <span className={cn(
                                "ml-2 px-1.5 py-0.5 rounded-sm text-[9px]",
                                selectedCategory === cat.name
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-500"
                            )}>
                                {getCategoryCount(cat.name)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Main 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-8 flex flex-col">

                        {/* Featured Article */}
                        {selectedCategory === "All" && currentPage === 1 && (
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-12 group">
                                <Link href={`/blogs/${featuredPost.slug}`} className="relative w-full md:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                                    <Image
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </Link>
                                <div className="flex flex-col justify-center flex-1 py-2">
                                    <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-bold tracking-widest uppercase">
                                        <span className="bg-[#D9A528] text-[#1F2937] px-2 py-1 rounded">FEATURED</span>
                                        <span className="text-[#2D5C35]">{featuredPost.category}</span>
                                        <span className="text-gray-400 normal-case tracking-normal font-medium">{featuredPost.date} · {featuredPost.readTime || "5 min read"}</span>
                                    </div>
                                    <Link href={`/blogs/${featuredPost.slug}`}>
                                        <h2 className="text-2xl md:text-3xl font-serif font-bold leading-snug mb-3 text-[#0A192F] group-hover:text-[#2D5C35] transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-500 text-sm md:text-base mb-6 line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                    <Link
                                        href={`/blogs/${featuredPost.slug}`}
                                        className="inline-flex items-center text-[#2D5C35] text-[11px] font-bold tracking-widest uppercase hover:text-[#17301A] transition-colors"
                                    >
                                        Read the story <ArrowRight className="ml-2 w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Divider before list if featured exists */}
                        {selectedCategory === "All" && currentPage === 1 && (
                            <hr className="border-gray-200 mb-8" />
                        )}

                        {/* Article List */}
                        <div className="flex flex-col">
                            {displayPosts.map((post, index) => (
                                <div key={post.id} className="group">
                                    <div className="flex flex-col sm:flex-row gap-6 py-8 items-center sm:items-start">
                                        <Link href={`/blogs/${post.slug}`} className="relative w-full sm:w-40 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </Link>

                                        <div className="flex-1 w-full flex flex-col justify-center pr-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[#D9A528] text-[9px] font-bold tracking-widest uppercase">
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {post.date} · {post.readTime?.toLowerCase() || "4 min read"}
                                                </span>
                                            </div>
                                            <Link href={`/blogs/${post.slug}`}>
                                                <h3 className="text-xl font-serif font-bold text-[#0A192F] group-hover:text-[#2D5C35] transition-colors mb-2 line-clamp-2">
                                                    {post.title}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-500 text-sm line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>

                                        <div className="hidden sm:flex shrink-0 items-center justify-center self-center">
                                            <Link
                                                href={`/blogs/${post.slug}`}
                                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:bg-[#F4F1EA] group-hover:border-gray-400 group-hover:text-[#17301A] transition-all"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Divider line between rows (hide on last item) */}
                                    {index < displayPosts.length - 1 && (
                                        <hr className="border-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
                                <div className="text-xs text-gray-500 font-medium">
                                    Showing {displayPosts.length} of {totalPostsCount} articles
                                </div>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentPage(i + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors border",
                                                currentPage === i + 1
                                                    ? "bg-[#17301A] text-white border-[#17301A]"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => {
                                            if (currentPage < totalPages) {
                                                setCurrentPage(prev => prev + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-2 px-4 py-1.5 ml-2 rounded border border-gray-200 bg-white text-xs font-bold text-[#17301A] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 flex flex-col gap-8">

                        {/* Most Read Widget */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-6">
                                Most Read
                            </h4>
                            <div className="flex flex-col gap-5">
                                {mostReadPosts.map((post, index) => (
                                    <Link key={post.id} href={`/blogs/${post.slug}`} className="flex gap-4 group">
                                        <div className="text-3xl font-serif text-[#EAE5D9] font-bold leading-none mt-1 group-hover:text-[#D9A528] transition-colors">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="flex flex-col">
                                            <h5 className="font-bold text-sm text-[#0A192F] group-hover:text-[#2D5C35] transition-colors mb-1 line-clamp-2">
                                                {post.title}
                                            </h5>
                                            <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                                {post.readTime?.toUpperCase() || "4 MIN READ"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Browse By Oil Widget */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">
                                Browse By Oil
                            </h4>
                            <div className="flex flex-col">
                                {browseByOil.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className={cn(
                                            "flex items-center justify-between py-4 text-sm",
                                            index < browseByOil.length - 1 ? "border-b border-gray-100" : ""
                                        )}
                                    >
                                        <span className="text-[#0A192F] font-medium hover:text-[#2D5C35] cursor-pointer transition-colors">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-gray-400 font-bold">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
