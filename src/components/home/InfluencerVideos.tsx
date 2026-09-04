"use client";

import { Play } from "lucide-react";
import Image from "next/image";

// Sample placeholder data for the videos. 
// We will use existing product images or general images as thumbnail backgrounds for now.
const videos = [
    { id: 1, image: "/images/product_groundnut.jpg", title: "Review 1" },
    { id: 2, image: "/images/product_almond.jpg", title: "Review 2" },
    { id: 3, image: "/images/product_coconut.jpg", title: "Review 3" },
    { id: 4, image: "/images/product_mustard.jpg", title: "Review 4" },
    { id: 5, image: "/images/product_ghee.jpg", title: "Review 5" },
];

export function InfluencerVideos() {
    return (
        <section className="bg-[#051114] py-16 md:py-24 relative overflow-hidden">
            {/* Dark background decorative rings (like the screenshot) */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-0 left-0 w-[600px] h-[600px] border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-white/5 rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold font-serif text-white leading-snug">
                        “If you’re looking for 100% pure, natural cold-pressed oils, you gotta check out Ekas!”
                    </h2>
                </div>

                {/* Hide scrollbar but allow horizontal scroll on mobile, flex row on desktop */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 scrollbar-hide snap-x">
                    {videos.map((vid) => (
                        <div 
                            key={vid.id} 
                            className="relative min-w-[260px] md:min-w-0 aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer snap-center bg-gray-900 border border-white/10 flex-shrink-0"
                        >
                            {/* Thumbnail Image */}
                            <Image 
                                src={vid.image} 
                                alt={vid.title} 
                                fill 
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                            />
                            
                            {/* Play Button Icon (Top Right) */}
                            <div className="absolute top-4 right-4 z-20">
                                <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                                    <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
