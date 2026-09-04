"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowRight, Calendar, Facebook, Twitter, Mail, Link as LinkIcon, CheckCircle2, Bookmark } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const readNextPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);
    const morePosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(3, 6);

    return (
        <article className="min-h-screen bg-[#F4F1EA] pt-8 pb-16 font-sans text-[#1F2937]">

            {/* Header Section */}
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center mb-10">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-4">
                    Blog / {post.category}
                </span>

                <span className="bg-[#17301A] text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-6">
                    {post.category}
                </span>

                <h1 className="text-3xl md:text-2xl lg:text-3xl font-serif font-bold text-[#0A192F] leading-tight mb-8 max-w-3xl">
                    {post.title}
                </h1>

                <div className="inline-flex items-center justify-center gap-4 md:gap-6 text-[10px] font-bold tracking-widest uppercase text-gray-500 border border-gray-300/60 rounded-full px-6 md:px-8 py-3 bg-white/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[#D9A528]" />
                        {post.date}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#D9A528]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {post.readTime?.toUpperCase() || "5 MIN READ"}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <button className="flex items-center gap-2 hover:text-[#17301A] transition-colors">
                        <Bookmark className="w-3 h-3 text-[#D9A528]" />
                        Save
                    </button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mb-16">
                <div className="relative w-full aspect-[21/9] md:h-[450px] rounded-[2rem] overflow-hidden shadow-sm">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Main Layout Structure */}
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Contents & Share */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col gap-12 sticky top-24 h-fit">
                        <div>
                            <h4 className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-6">
                                CONTENTS
                            </h4>
                            <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                                <li className="text-[#17301A] font-bold border-l-2 border-[#17301A] pl-3 -ml-[2px]">
                                    Cold-pressed purity
                                </li>
                                <li className="hover:text-[#17301A] cursor-pointer transition-colors">
                                    Health benefits
                                </li>
                                <li className="hover:text-[#17301A] cursor-pointer transition-colors">
                                    Using it in the kitchen
                                </li>
                                <li className="hover:text-[#17301A] cursor-pointer transition-colors">
                                    Choosing the right bottle
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                                SHARE
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                <button className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors">
                                    <Facebook className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors">
                                    <Twitter className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors">
                                    <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#17301A] hover:border-[#17301A] transition-colors">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Rich Content */}
                    <div className="lg:col-span-7 flex flex-col text-gray-600 leading-relaxed text-sm md:text-base">

                        {/* Intro paragraph */}
                        <p className="text-lg md:text-xl font-serif text-[#1F2937] italic border-l-2 border-[#17301A] pl-5 md:pl-8 mb-8 leading-relaxed">
                            If you've been searching for a clean, flavourful oil for everyday cooking, you're probably come across wood-pressed white sesame oil. It's gaining attention for good reasons — and the version from our mill is a good place to start.
                        </p>

                        <p className="mb-6">
                            Wood-pressing is the slow route. A wooden mortar and pestle turns at low speed, the seed paste never heats past roughly 45°C, and the oil leaves the press without solvents, bleaching or deodorising. What you pour is close to what the seed held.
                        </p>

                        <h3 className="text-2xl font-serif font-bold text-[#0A192F] mt-6 mb-4">
                            The secret behind cold-pressed purity
                        </h3>
                        <p className="mb-8">
                            Heat is what strips an oil. Industrial expellers run hot enough to degrade vitamin E and the natural antioxidants sesamol and sesamin. Keep the temperature down and those compounds stay in the bottle — which is also why a genuine wood-pressed oil smells nutty rather than neutral.
                        </p>

                        {/* Stats grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-[#F9F7F1] border border-[#EAE5D9]/60 rounded-xl p-6 text-center shadow-sm">
                                <h4 className="text-3xl font-serif font-bold text-[#8C6D3F] mb-3">&lt;45°C</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Press temperature<br />keeps nutrients<br />intact</p>
                            </div>
                            <div className="bg-[#F9F7F1] border border-[#EAE5D9]/60 rounded-xl p-6 text-center shadow-sm">
                                <h4 className="text-3xl font-serif font-bold text-[#8C6D3F] mb-3">0</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Solvents, bleaching<br />or deodorising</p>
                            </div>
                            <div className="bg-[#F9F7F1] border border-[#EAE5D9]/60 rounded-xl p-6 text-center shadow-sm">
                                <h4 className="text-3xl font-serif font-bold text-[#8C6D3F] mb-3">210°C</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Safe smoke point for<br />daily cooking</p>
                            </div>
                        </div>

                        {/* Did You Know box */}
                        <div className="bg-[#F9F7F1] border border-[#EAE5D9]/60 border-l-4 border-l-[#17301A] rounded-r-2xl p-6 md:p-8 mb-10">
                            <h4 className="font-bold font-serif text-[#1F2937] text-lg mb-2">Did You Know?</h4>
                            <p className="text-sm">
                                Sesame oil holds up to about 210°C — high enough for everyday tempering and shallow frying — and used regularly, most people notice the difference in flavour within a week of switching.
                            </p>
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-[#0A192F] mb-6">
                            Health benefits worth the switch
                        </h3>
                        <ul className="flex flex-col gap-5 mb-10 text-sm md:text-base">
                            <li className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-[#2D5C35] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-[#1F2937]">Heart-friendly fats</strong> — mostly unsaturated, with a balanced omega-6 to omega-9 profile.
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-[#2D5C35] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-[#1F2937]">Antioxidant rich</strong> — sesamol and sesamin survive the low-heat press and help the oil resist rancidity.
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-[#2D5C35] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-[#1F2937]">Skin and hair</strong> — long used in Ayurvedic abhyanga for its light, non-greasy absorption.
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <CheckCircle2 className="w-5 h-5 text-[#2D5C35] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-[#1F2937]">Bone support</strong> — a natural source of calcium, magnesium and zinc from the seed itself.
                                </div>
                            </li>
                        </ul>

                        <h3 className="text-2xl font-serif font-bold text-[#0A192F] mb-6">
                            Choosing the right bottle
                        </h3>

                        {/* Custom Table */}
                        <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden mb-10 text-sm">
                            <div className="flex flex-col sm:flex-row border-b border-[#EAE5D9]">
                                <div className="sm:w-1/4 bg-[#F9F7F1] p-4 font-bold text-[10px] tracking-widest uppercase text-gray-500 sm:border-r border-[#EAE5D9]">
                                    LABEL
                                </div>
                                <div className="sm:w-3/4 p-4 text-gray-600 bg-white">
                                    Look for "wood-pressed" or "kachi ghani" — "cold-pressed" alone can still mean machine expeller.
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row border-b border-[#EAE5D9]">
                                <div className="sm:w-1/4 bg-[#F9F7F1] p-4 font-bold text-[10px] tracking-widest uppercase text-gray-500 sm:border-r border-[#EAE5D9]">
                                    CLARITY
                                </div>
                                <div className="sm:w-3/4 p-4 text-gray-600 bg-white">
                                    A faint sediment is normal and good. Water-clear oil usually means it was filtered hard or refined.
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row border-b border-[#EAE5D9]">
                                <div className="sm:w-1/4 bg-[#F9F7F1] p-4 font-bold text-[10px] tracking-widest uppercase text-gray-500 sm:border-r border-[#EAE5D9]">
                                    AROMA
                                </div>
                                <div className="sm:w-3/4 p-4 text-gray-600 bg-white">
                                    It should smell distinctly of sesame. Neutral smell means the character was processed out.
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-1/4 bg-[#F9F7F1] p-4 font-bold text-[10px] tracking-widest uppercase text-gray-500 sm:border-r border-[#EAE5D9]">
                                    PACKAGING
                                </div>
                                <div className="sm:w-3/4 p-4 text-gray-600 bg-white">
                                    Dark glass or food-grade opaque containers; oil degrades in clear plastic on a bright shelf.
                                </div>
                            </div>
                        </div>

                        {/* Product CTA */}
                        <div className="bg-[#17301A] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-8 items-center text-white mb-10 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none"></div>

                            <div className="w-32 h-32 shrink-0 bg-white/10 rounded-xl flex items-center justify-center p-2">
                                {/* Use generic bottle placeholder for mock UI */}
                                <div className="relative w-full h-full">
                                    <Image src="/images/product_sesame.jpg" alt="Sesame Oil" fill className="object-cover rounded-lg" />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 relative z-10 text-center sm:text-left">
                                <span className="text-[#D9A528] text-[9px] font-bold tracking-widest uppercase mb-2">
                                    FROM OUR MILL
                                </span>
                                <h4 className="text-xl font-serif font-bold mb-2">
                                    EKAS Wood-Pressed White Sesame Oil
                                </h4>
                                <p className="text-gray-300 text-xs mb-6 max-w-sm">
                                    Unrefined, single-origin seed, pressed to order. 500 ml • 1 L • 5 L
                                </p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                    <Link href="/product/1" className="bg-[#D9A528] hover:bg-[#c49321] text-[#17301A] font-bold px-6 py-2.5 rounded-full text-xs transition-colors flex items-center gap-2">
                                        Shop 500ml <ArrowRight className="w-3 h-3" />
                                    </Link>
                                    <span className="font-bold text-sm">₹399 <span className="text-gray-400 font-normal text-xs">/ 500 ml</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Feedback block */}
                        <div className="bg-[#F9F7F1] border border-[#EAE5D9]/60 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Was this article helpful?</span>
                            <div className="flex gap-3">
                                <button className="px-6 py-2 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-600 hover:border-[#17301A] hover:text-[#17301A] transition-colors">
                                    Yes
                                </button>
                                <button className="px-6 py-2 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
                                    Not really
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Key Takeaways & Read Next */}
                    <div className="lg:col-span-3 flex flex-col gap-8">

                        {/* Key Takeaways */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-5">
                                KEY TAKEAWAYS
                            </h4>
                            <ul className="flex flex-col gap-4 text-xs text-gray-600">
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9A528] mt-1.5 shrink-0" />
                                    <span>Wood-pressing stays under ~45 °C; all vitamin E and antioxidants survive the press.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9A528] mt-1.5 shrink-0" />
                                    <span>Smoke point is around 210 °C — safe for tempering and shallow frying.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9A528] mt-1.5 shrink-0" />
                                    <span>Buy unrefined, in dark glass, and finish within three months of opening.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Read Next */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">
                                READ NEXT
                            </h4>
                            <div className="flex flex-col gap-6">
                                {readNextPosts.map(p => (
                                    <Link key={p.id} href={`/blogs/${p.slug}`} className="flex gap-4 group items-start">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                            <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <h5 className="font-serif font-bold text-sm text-[#0A192F] mb-1.5 line-clamp-2 group-hover:text-[#2D5C35] transition-colors">
                                                {p.title}
                                            </h5>
                                            <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                                {p.readTime?.toUpperCase() || "4 MIN READ"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Section: More from the kitchen */}
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-24 mb-8">
                <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
                    <h3 className="text-2xl font-serif font-bold text-[#0A192F]">
                        More from the kitchen
                    </h3>
                    <Link href="/blogs" className="text-[11px] font-bold tracking-widest uppercase text-[#2D5C35] hover:text-[#17301A] transition-colors flex items-center gap-1">
                        All articles <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {morePosts.map(p => (
                        <Link key={p.id} href={`/blogs/${p.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="relative w-full aspect-[4/3] bg-gray-100">
                                <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[#D9A528] text-[9px] font-bold tracking-widest uppercase">
                                        {p.category}
                                    </span>
                                </div>
                                <h4 className="text-lg font-serif font-bold text-[#0A192F] group-hover:text-[#2D5C35] transition-colors mb-4 line-clamp-2">
                                    {p.title}
                                </h4>
                                <div className="mt-auto">
                                    <span className="text-xs text-gray-400 font-medium">
                                        {p.date} · {p.readTime?.toLowerCase() || "4 min read"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </article>
    );
}
