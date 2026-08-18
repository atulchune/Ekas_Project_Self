"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowLeft, Calendar, Facebook, Twitter, Share2, Clock, Linkedin } from "lucide-react";
import { notFound } from "next/navigation";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-[#F4F1EA] pt-32 pb-24">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center text-gray-500 hover:text-[#2D5C35] transition-colors text-xs font-bold uppercase tracking-widest gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Blogs
                    </Link>
                </div>

                {/* Article Header - Centered & Clean */}
                <div className="text-center mb-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="bg-[#2D5C35] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                            {post.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#1F2937] leading-tight mb-6">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-wider border-y border-gray-200 py-4 mx-auto w-fit px-8">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#D9A528]" /> {post.date}</span>
                        <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#D9A528]" /> 5 min read</span>
                    </div>
                </div>

                {/* Featured Image - Contained & Elegant */}
                <div className="relative h-[400px] w-full rounded-[2rem] overflow-hidden shadow-xl mb-12 border border-white/50">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-[#2D5C35]/5 relative">
                    {/* Share Buttons Floating - Desktop: Left, Mobile: Bottom */}
                    <div className="hidden xl:flex absolute -left-20 top-16 flex-col gap-3">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#1877F2] border border-gray-100 shadow-sm hover:scale-110 transition-all"><Facebook className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] border border-gray-100 shadow-sm hover:scale-110 transition-all"><Twitter className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#0077b5] border border-gray-100 shadow-sm hover:scale-110 transition-all"><Linkedin className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#2D5C35] border border-gray-100 shadow-sm hover:scale-110 transition-all"><Share2 className="w-4 h-4" /></button>
                    </div>

                    <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[#1F2937] prose-p:text-gray-600 prose-a:text-[#2D5C35] prose-strong:text-[#2D5C35] max-w-none">
                        <p className="lead text-xl text-gray-800 font-medium mb-8 not-prose border-l-4 border-[#D9A528] pl-6 italic">
                            {post.excerpt}
                        </p>

                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <h3>The Secret Behind Cold-Pressed Purity</h3>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <div className="bg-[#FDFAF5] p-6 rounded-xl border-l-4 border-[#2D5C35] my-8 not-prose">
                            <h4 className="font-bold font-serif text-[#1F2937] text-lg mb-2">Did You Know?</h4>
                            <p className="text-gray-600 text-sm">Use <strong>{post.title}</strong> regularly to experience visible health benefits within just 4 weeks.</p>
                        </div>
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                    </div>

                    {/* Mobile Share Section */}
                    <div className="xl:hidden mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-[#1F2937] text-sm uppercase tracking-wide">Share this article</span>
                        <div className="flex gap-3">
                            <button className="p-2 bg-gray-50 rounded-full text-[#1877F2]"><Facebook className="w-5 h-5" /></button>
                            <button className="p-2 bg-gray-50 rounded-full text-[#1DA1F2]"><Twitter className="w-5 h-5" /></button>
                            <button className="p-2 bg-gray-50 rounded-full text-[#2D5C35]"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
