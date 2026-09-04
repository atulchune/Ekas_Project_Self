"use client";

import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const videos = [
    { id: 1, image: "/images/product_groundnut.jpg" },
    { id: 2, image: "/images/product_almond.jpg" },
    { id: 3, image: "/images/product_coconut.jpg" },
    { id: 4, image: "/images/product_mustard.jpg" },
    { id: 5, image: "/images/product_ghee.jpg" },
    { id: 6, image: "/images/product_sesame.jpg" },
];

const reviews = [
    {
        id: 1,
        text: "A variety of ways to use my favourite coconut oil and honey. My skin feels nourished, my cuticles are soft, my lips are smooth, and many other benefits come from using them!",
        name: "Minerva Thakur",
    },
    {
        id: 2,
        text: "Their ghee helped solve my acid reflux problem. While cooking with wood pressed oils imparts a unique taste and I feel lighter.",
        name: "Lakshmi Dev",
    },
    {
        id: 3,
        text: "This ghee is the most healthy option out there for children. I use it regularly for my daughter and she loves the taste.",
        name: "Dr Shagun Walia",
    },
    {
        id: 4,
        text: "Works very well for holistic healing! It is very sweet and tastes like nobody's business :)",
        name: "Pankaj Tiwari",
    },
    {
        id: 5,
        text: "Best quality oils I have ever used. Highly recommend to everyone who cares about their health.",
        name: "Anita Sharma",
    }
];

export function Testimonials() {
    const videoScrollRef = useRef<HTMLDivElement>(null);
    const reviewScrollRef = useRef<HTMLDivElement>(null);

    const scrollVideos = (direction: 'left' | 'right') => {
        if (videoScrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            videoScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollReviews = (direction: 'left' | 'right') => {
        if (reviewScrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            reviewScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Reusable CSS to aggressively hide scrollbars across all browsers
    const hideScrollbarClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']";

    return (
        <section className="bg-[#FAFAFA] py-12 md:py-16 border-t border-gray-100 overflow-hidden">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 relative">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1F2937] mb-2">
                        What Do Our Customers Say
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
                        If you're looking for 100% pure, natural cold-pressed oils, you gotta check out Ekas!
                    </p>
                </div>

                {/* Videos Section */}
                <div className="relative mb-8 group/videos">
                    <button onClick={() => scrollVideos('left')} className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-[#2E4F32] hover:text-white hover:scale-105 transition-all opacity-0 group-hover/videos:opacity-100">
                        <ChevronLeft className="w-4 h-4 pr-0.5" strokeWidth={2.5} />
                    </button>

                    <div 
                        ref={videoScrollRef}
                        className={`flex overflow-x-auto pb-4 gap-3 md:gap-4 snap-x scroll-smooth ${hideScrollbarClass}`}
                    >
                        {videos.map((vid) => (
                            <div 
                                key={vid.id} 
                                className="relative min-w-[140px] md:min-w-[16%] flex-1 aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer snap-center bg-gray-900 shadow-sm"
                            >
                                <Image 
                                    src={vid.image} 
                                    alt="Customer Review Video"
                                    fill 
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 z-20">
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                        <Play className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white ml-0.5" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={() => scrollVideos('right')} className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-[#2E4F32] hover:text-white hover:scale-105 transition-all opacity-0 group-hover/videos:opacity-100">
                        <ChevronRight className="w-4 h-4 pl-0.5" strokeWidth={2.5} />
                    </button>
                </div>

                {/* Text Reviews Section */}
                <div className="relative group/reviews">
                    <div 
                        ref={reviewScrollRef}
                        className={`flex overflow-x-auto pb-4 pt-2 gap-4 md:gap-5 snap-x scroll-smooth ${hideScrollbarClass}`}
                    >
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-[260px] md:min-w-[20%] flex-1 flex flex-col snap-center">
                                <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed mb-5 flex-grow">
                                    {review.text}
                                </p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-8 h-8 rounded-full bg-[#17301A] flex items-center justify-center text-white font-bold text-xs">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-[#1F2937] font-bold text-xs md:text-[13px] font-serif">{review.name}</h4>
                                        <div className="flex gap-0.5 mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-2.5 h-2.5 fill-[#FFC107] text-[#FFC107]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Slider Controls at the bottom (matching screenshot) */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button onClick={() => scrollReviews('left')} className="w-10 h-10 rounded-full border border-[#2E4F32] flex items-center justify-center text-[#2E4F32] hover:bg-[#2E4F32] hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2E4F32] cursor-pointer transition-colors"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors"></div>
                    </div>
                    <button onClick={() => scrollReviews('right')} className="w-10 h-10 rounded-full border border-[#2E4F32] flex items-center justify-center text-[#2E4F32] hover:bg-[#2E4F32] hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </section>
    );
}
