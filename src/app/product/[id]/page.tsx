"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Minus, Plus, Heart, Share2, Maximize2, RefreshCw, CheckCircle2, ChevronRight, Truck, Info, Leaf, ThumbsUp, ChevronDown, ArrowRight, X, ShieldCheck, Search, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { LabTested } from "@/components/home/LabTested";
import OfferBand, { OFFERS } from "@/components/ui/OfferBand";
import React from 'react';

const UgcVideo = ({ src, isPlaying, isMuted, onTogglePlay, onToggleMute }: { src: string, isPlaying: boolean, isMuted: boolean, onTogglePlay: () => void, onToggleMute: () => void }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    
    React.useEffect(() => {
        if (isPlaying) {
            videoRef.current?.play().catch(() => {});
        } else {
            videoRef.current?.pause();
        }
    }, [isPlaying]);

    return (
        <div 
            className="relative aspect-[4/5] bg-[#F9F7F2] rounded-xl overflow-hidden border border-gray-200/50 group cursor-pointer hover:shadow-md transition-all"
            onClick={onTogglePlay}
        >
            <video
                ref={videoRef}
                src={src}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
            />
            {/* Dark overlay when paused */}
            {!isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#17301A] group-hover:scale-110 transition-transform shadow-sm">
                        <Play className="w-4 h-4 ml-1" fill="currentColor" />
                    </div>
                </div>
            )}
            
            {/* Controls overlay when playing (shows on hover) */}
            {isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} 
                            className="w-7 h-7 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <Pause className="w-3 h-3" fill="currentColor" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleMute(); }} 
                            className="w-7 h-7 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = PRODUCTS.find(p => p.id === id || p.slug === id);

    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { addItem } = useCart();

    const [playingUgcIndex, setPlayingUgcIndex] = useState<number | null>(0);
    const [ugcMuted, setUgcMuted] = useState(true);

    // Quick add modal state
    const [quickAddProduct, setQuickAddProduct] = useState<typeof PRODUCTS[0] | null>(null);
    const [quickAddSizeIndex, setQuickAddSizeIndex] = useState(0);

    // FAQ state
    const [faqSearch, setFaqSearch] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Sticky Bar state
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Review animation state
    const [activeReviewIndex, setActiveReviewIndex] = useState(0);

    const PRODUCT_REVIEWS = [
        { text: `"Best wood-pressed oil I've used. Authentic aroma!"`, author: "Priya S." },
        { text: `"You can really tell it's unrefined. Great for cooking."`, author: "Rahul M." },
        { text: `"Love the traditional extraction method. Tastes pure."`, author: "Sneha K." },
        { text: `"Makes my curries taste amazing. Highly recommend."`, author: "Anita D." },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveReviewIndex((prev) => (prev + 1) % PRODUCT_REVIEWS.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky bar when scrolled past the main add to cart button (approx 600px)
            if (window.scrollY > 600) {
                setShowStickyBar(true);
            } else {
                setShowStickyBar(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Zoom state
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center center", transform: "scale(1)" });

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(1.8)"
        });
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") return;
        setZoomStyle({
            transformOrigin: "center center",
            transform: "scale(1)"
        });
    };

    if (!product) {
        return notFound();
    }

    const galleryMedia = [...product.images.gallery];
    if (product.videos?.listing) {
        galleryMedia.push(product.videos.listing);
    }
    const activeMedia = galleryMedia[activeImageIndex] || product.image;
    const isVideo = (url: string) => url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov');

    const activeSize = product.sizes[selectedSizeIndex];
    const discount = activeSize.originalPrice
        ? Math.round(((activeSize.originalPrice - activeSize.price) / activeSize.originalPrice) * 100)
        : 0;
    const saveAmount = activeSize.originalPrice ? activeSize.originalPrice - activeSize.price : 0;

    // Helper for per litre calculation
    const getPerLitrePrice = () => {
        const sizeLabel = activeSize.label.toLowerCase();
        let volumeMl = 1000;
        if (sizeLabel.includes('ml')) {
            volumeMl = parseInt(sizeLabel);
        } else if (sizeLabel.includes('litre') || sizeLabel.includes('l')) {
            volumeMl = parseInt(sizeLabel.replace(/[^\d]/g, '')) * 1000;
        }
        if (volumeMl > 0) {
            return Math.round((activeSize.price / volumeMl) * 1000);
        }
        return activeSize.price;
    };

    const MARQUEE_TEXTS = [
        "WOOD-PRESSED", "NO PRESERVATIVES", "FSSAI LICENSED", "100% ORGANIC", "CHEMICAL FREE", "BATCH LAB TESTED", "COLD WOOD-PRESSED"
    ];

    const FAQS = [
        { q: "Why has my oil turned solid and white?", a: "Coconut oil sets below about 24°C. It is the clearest sign you have an unrefined oil — stand the bottle in warm water for a minute and it turns clear again. Never microwave it." },
        { q: "Can I deep fry in this?", a: "Yes, our wood-pressed oils have a high smoke point making them perfectly safe and healthy for deep frying." },
        { q: "Why does the colour differ from my last bottle?", a: "Because it is a natural, unrefined product. Minor variations in colour and aroma are expected and prove its authenticity." },
        { q: "How long does it keep after opening?", a: "It is best consumed within 6-12 months of opening. Keep it away from direct sunlight." },
        { q: "Is this the same as virgin coconut oil?", a: "No, virgin coconut oil is extracted from fresh coconut milk, while ours is wood-pressed from sun-dried copra for a deeper, nuttier flavor." },
        { q: "Can I use it on hair and skin?", a: "Absolutely. It is an excellent, natural moisturizer without any harsh chemicals." },
        { q: "What does the batch code on the cap tell me?", a: "It traces back to the exact week of harvest and the specific ghani pressing batch." }
    ];

    const filteredFaqs = FAQS.filter(faq => faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#F9F7F2] font-sans pb-10">
            {/* Offer Band below Navbar */}
            <div>
                <OfferBand {...OFFERS.coconut} />
            </div>

            {/* 1. Breadcrumbs & Top Spacing */}
            <div className="pt-6 lg:pt-10 pb-6">
                <div className="w-full px-4 md:px-8 xl:px-16 2xl:px-24">
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                        <Link href="/" className="hover:text-[#2D5C35] transition-colors">HOME</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-[#2D5C35] transition-colors">{product.category}</Link>
                        <span>/</span>
                        <span className="text-[#2D5C35]">{product.name}</span>
                    </nav>

                    {/* Main Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20 animate-fade-in">

                        {/* LEFT COLUMN: Gallery */}
                        <div className="lg:col-span-6">
                            <div className="sticky top-28 space-y-4 z-10">
                                {/* Main Image Container */}
                                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[calc(100vh-220px)] lg:max-h-[750px] bg-transparent rounded-3xl overflow-hidden shadow-sm">
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                        {product.badge && (
                                            <span className="bg-[#1F2937] text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                {product.badge}
                                            </span>
                                        )}
                                        {discount > 0 && (
                                            <span className="bg-[#8C6D3F] text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                        <button className="bg-white/90 backdrop-blur text-[#1F2937] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors">
                                            <RefreshCw className="w-3 h-3" /> 360°
                                        </button>
                                        <button className="bg-white/90 backdrop-blur text-[#1F2937] p-1.5 rounded-full shadow-sm hover:bg-white transition-colors">
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Media with Zoom effect */}
                                    <div
                                        className={cn("absolute inset-0 w-full h-full", !isVideo(activeMedia) ? "cursor-zoom-in" : "")}
                                        onPointerMove={!isVideo(activeMedia) ? handlePointerMove : undefined}
                                        onPointerLeave={!isVideo(activeMedia) ? handlePointerLeave : undefined}
                                    >
                                        <div className="relative w-full h-full overflow-hidden rounded-3xl">
                                            {isVideo(activeMedia) ? (
                                                <video 
                                                    src={activeMedia} 
                                                    className="w-full h-full object-cover" 
                                                    autoPlay 
                                                    loop 
                                                    muted 
                                                    playsInline
                                                />
                                            ) : (
                                                <Image
                                                    src={activeMedia}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-100 ease-out pointer-events-none"
                                                    style={zoomStyle}
                                                    priority
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnails Row */}
                                <div className="grid grid-cols-5 gap-3">
                                    {galleryMedia.map((media, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImageIndex(i)}
                                            className={cn(
                                                "relative aspect-square rounded-xl overflow-hidden border transition-all flex flex-col items-center justify-center bg-transparent",
                                                activeImageIndex === i
                                                    ? "border-[#2D5C35] ring-1 ring-[#2D5C35] scale-[1.02]"
                                                    : "border-gray-200/50 hover:border-gray-300 opacity-70 hover:opacity-100"
                                            )}
                                        >
                                            <div className="relative w-full h-full">
                                                {isVideo(media) ? (
                                                    <video src={media} className="object-cover w-full h-full" muted playsInline />
                                                ) : (
                                                    <Image src={media} alt="" fill className="object-cover" />
                                                )}
                                                {isVideo(media) && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                        <Play className="w-4 h-4 text-white fill-white drop-shadow-md" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Info Strip */}
                                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider py-4">
                                    <div className="flex items-center gap-1.5"><Leaf className="w-3 h-3 text-[#2D5C35]" /> Pressed at 42°C</div>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-[#2D5C35]" /> FSSAI Licensed</div>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#2D5C35]" /> Pressed by women</div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Details */}
                        <div className="lg:col-span-6 flex flex-col pt-0">
                            {/* Rating */}
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mb-2">
                                <div className="flex items-center text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                    <span className="text-[#1F2937] font-bold ml-1.5 text-sm">{product.rating}</span>
                                </div>
                                <span className="underline decoration-dotted hover:text-[#2D5C35] cursor-pointer">{product.reviews} reviews</span>
                                <span className="text-gray-300">•</span>
                                <span>2,140 bottles this month</span>
                            </div>

                            {/* Title & Desc */}
                            <h1 className="text-3xl lg:text-4xl font-bold font-serif text-[#1F2937] leading-tight mb-2 tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4 max-w-xl line-clamp-3">
                                {product.description}
                            </p>

                            {/* Price */}
                            <div className="flex flex-col mb-4">
                                <div className="flex items-end gap-3 mb-1">
                                    <span className="text-3xl font-bold text-[#1F2937]">₹{activeSize.price}</span>
                                    {activeSize.originalPrice && (
                                        <>
                                            <span className="text-lg text-gray-400 line-through mb-1">₹{activeSize.originalPrice}</span>
                                            <span className="text-[10px] font-bold text-[#8C6D3F] bg-[#D9A528]/10 px-2 py-0.5 rounded-md mb-1.5">
                                                Save ₹{saveAmount}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <span className="text-[11px] text-gray-500 font-medium">₹{getPerLitrePrice()} per litre - Inclusive of all taxes</span>
                            </div>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SELECT SIZE</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSizeIndex(idx)}
                                            className={cn(
                                                "h-[42px] min-w-[52px] px-4 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-bold tracking-wide",
                                                selectedSizeIndex === idx
                                                    ? "border-[1.5px] border-[#17301A] text-[#17301A]"
                                                    : "border border-gray-300 bg-transparent text-gray-600 hover:border-gray-400"
                                            )}
                                        >
                                            <span className="uppercase">{size.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Animated Reviews */}
                            <div className="h-[65px] overflow-hidden relative mb-4 mt-2">
                                {PRODUCT_REVIEWS.map((review, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-in-out",
                                            activeReviewIndex === idx
                                                ? "opacity-100 translate-y-0"
                                                : activeReviewIndex === (idx - 1 + PRODUCT_REVIEWS.length) % PRODUCT_REVIEWS.length
                                                    ? "opacity-0 -translate-y-8 pointer-events-none"
                                                    : "opacity-0 translate-y-8 pointer-events-none"
                                        )}
                                    >
                                        <div className="flex items-center gap-1 text-[#D9A528] mb-1.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                                        </div>
                                        <p className="text-[13px] text-gray-700 font-medium italic mb-1 line-clamp-1">{review.text}</p>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">— {review.author}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                                {/* Qty */}
                                <div className="flex items-center bg-white rounded-full border border-gray-300 px-2 h-[50px] shrink-0 w-32 justify-between">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-[#17301A] transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-8 text-center font-bold text-[#1F2937] text-sm">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-600 hover:text-[#17301A] transition-colors"><Plus className="w-4 h-4" /></button>
                                </div>

                                {/* Buttons */}
                                <button
                                    onClick={() => addItem(product, quantity, activeSize.label, activeSize.price)}
                                    className="flex-1 w-full bg-[#1F3D28] text-white font-bold rounded-full h-[50px] hover:bg-[#17301A] transition-all flex items-center justify-center text-[11px] tracking-widest uppercase shadow-sm"
                                >
                                    ADD TO CART
                                </button>
                                <button className="flex-1 w-full bg-[#E6C387] text-[#1F3D28] font-bold rounded-full h-[50px] hover:bg-[#D9B575] transition-all flex items-center justify-center text-[11px] tracking-widest uppercase shadow-sm">
                                    BUY NOW
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gray-200 my-6"></div>

                            {/* See It In Real Kitchens (Right Column) */}
                            {product.videos?.ugc && product.videos.ugc.length > 0 && (
                                <div className="w-full mb-4">
                                    <div className="mb-4">
                                        <h3 className="text-[13px] font-bold text-[#17301A] mb-1">See It In Real Kitchens</h3>
                                        <p className="text-[11px] text-gray-500 font-medium">Real people, real cooking, real EKAS.</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {product.videos.ugc.slice(0, 3).map((video, idx) => (
                                            <UgcVideo
                                                key={idx}
                                                src={video}
                                                isPlaying={playingUgcIndex === idx}
                                                isMuted={ugcMuted}
                                                onTogglePlay={() => setPlayingUgcIndex(playingUgcIndex === idx ? null : idx)}
                                                onToggleMute={() => setUgcMuted(!ugcMuted)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Strip */}
            <div className="bg-[#17301A] text-white py-4 overflow-hidden flex relative whitespace-nowrap mt-8">
                <div className="animate-marquee inline-block">
                    {MARQUEE_TEXTS.map((text, i) => (
                        <span key={i} className="mx-4 text-xs font-bold tracking-[0.2em] inline-flex items-center justify-center">
                            {text} <span className="ml-8 text-[#8C6D3F]">•</span>
                        </span>
                    ))}
                    {MARQUEE_TEXTS.map((text, i) => (
                        <span key={`dup-${i}`} className="mx-4 text-xs font-bold tracking-[0.2em] inline-flex items-center justify-center">
                            {text} <span className="ml-8 text-[#8C6D3F]">•</span>
                        </span>
                    ))}
                </div>
                <div className="animate-marquee2 inline-block absolute top-4">
                    {MARQUEE_TEXTS.map((text, i) => (
                        <span key={`dup2-${i}`} className="mx-4 text-xs font-bold tracking-[0.2em] inline-flex items-center justify-center">
                            {text} <span className="ml-8 text-[#8C6D3F]">•</span>
                        </span>
                    ))}
                    {MARQUEE_TEXTS.map((text, i) => (
                        <span key={`dup3-${i}`} className="mx-4 text-xs font-bold tracking-[0.2em] inline-flex items-center justify-center">
                            {text} <span className="ml-8 text-[#8C6D3F]">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* PRODUCT DOSSIER (Enterprise Layout) */}
            <div className="w-full px-4 md:px-8 xl:px-16 2xl:px-24 py-16">

                {/* Dossier Section 1: Product Description & Ingredients */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-20 bg-[#FBF9F4] rounded-[2rem] p-8 md:p-12 lg:p-16 border border-gray-100/50">
                    {/* Left: Text & Features */}
                    <div className="flex flex-col justify-center gap-8 lg:pr-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black font-serif text-[#17301A] leading-tight mb-4 tracking-tight">
                                Product Description
                            </h2>
                            <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl md:text-3xl font-black font-serif text-[#17301A] leading-tight mb-4 tracking-tight">
                                Ingredients
                            </h2>
                            <p className="text-[14px] text-gray-600 leading-relaxed font-medium mb-8">
                                100% Pure Wood-Pressed {product.name.replace('EKAS Wood Pressed ', '').replace(' Oil', '')} Seeds. No additives, no preservatives, no artificial colors.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.features.slice(0, 4).map((feature, i) => (
                                    <div key={i} className="bg-[#F6F4EE] border border-gray-200/50 rounded-xl p-4 flex gap-3 items-start">
                                        <div className="bg-[#EAE8E2] w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                            <Leaf className="w-4 h-4 text-[#17301A]" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-[#17301A] mb-1">{feature}</h4>
                                            <p className="text-[10px] text-gray-500 font-medium">Naturally preserved properties</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                            <a href="#nutrition" className="text-[11px] font-bold text-[#17301A] uppercase tracking-widest border-b-[1.5px] border-[#17301A] pb-0.5 hover:text-[#2D5C35] hover:border-[#2D5C35] transition-colors">VIEW NUTRITION FACTS LABEL</a>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <a href="#process" className="text-[11px] font-medium text-gray-500 flex items-center gap-1 hover:text-[#17301A] transition-colors">How we press our oil <ChevronRight className="w-3 h-3" /></a>
                        </div>
                    </div>

                    {/* Right: Product Gallery First Image */}
                    <div className="w-full relative rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 min-h-[400px]">
                        <Image src={product.images.gallery[0]} alt="Product Image" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <h3 className="text-white text-xl font-bold font-serif mb-1">Non-GMO {product.name.replace('EKAS Wood Pressed ', '').replace(' Oil', '')}s</h3>
                            <p className="text-[#D9B575] text-xs font-medium tracking-wide">Harvested at peak golden bloom</p>
                        </div>
                    </div>
                </div>

                {/* Dossier Section 1b: Video Banner */}
                <div className="w-full mb-10">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-4 block">FROM DECCAN SOIL TO YOUR TABLE</span>
                        <h2 className="text-4xl lg:text-5xl font-bold font-serif text-[#17301A] tracking-tight">LIGHTNESS IN EVERY DROP</h2>
                    </div>
                    <div className="w-full relative overflow-hidden flex items-center justify-center aspect-video lg:aspect-[21/9]">
                        {product.videos?.productPage ? (
                            <video
                                src={product.videos.productPage}
                                className="absolute inset-0 w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=1&mute=1&loop=1&playlist=jfKfPfyJRdk"
                                title="Product Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* FAQ SECTION */}
                <div className="w-full mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-3 block">QUESTIONS</span>
                            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#17301A] leading-none">Before you buy</h2>
                        </div>
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={faqSearch}
                                onChange={(e) => setFaqSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2D5C35] focus:border-[#2D5C35] transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 w-full">
                        {filteredFaqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div key={index} className="bg-[#FCFCFA] rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                        className="w-full px-5 py-4 md:px-6 md:py-4 flex items-center justify-between focus:outline-none group text-left"
                                    >
                                        <span className="text-[14px] md:text-[15px] font-medium text-[#1F2937] pr-4">{faq.q}</span>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                            isOpen ? "bg-[#17301A] text-white" : "bg-[#EFEFEA] text-gray-500 group-hover:bg-[#E5E5DF]"
                                        )}>
                                            {isOpen ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                        </div>
                                    </button>
                                    <div
                                        className={cn(
                                            "grid transition-all duration-300 ease-in-out",
                                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 md:px-6 md:pb-5 pt-0 pr-12 md:pr-24">
                                                <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed font-light">{faq.a}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredFaqs.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No questions found matching "{faqSearch}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="-mx-4 md:-mx-8 xl:-mx-16 2xl:-mx-24 pt-8">
                    <LabTested />
                </div>


                {/* REVIEWS SECTION */}
                <div className="w-full mb-20 bg-[#FBF9F4] rounded-[2rem] p-6 md:p-10 lg:p-16 border border-gray-100/50">
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
                        <div>
                            <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-3 block">CUSTOMER TRANSPARENCY</span>
                            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-[#17301A] mb-3 tracking-tight">Real Customer Reviews</h2>
                            <p className="text-sm text-gray-600 font-medium">Authentic experiences from everyday home chefs, culinary experts, and families.</p>
                        </div>
                        <button className="bg-[#17301A] text-white text-[11px] font-bold px-6 py-3.5 rounded-full flex items-center gap-2.5 hover:bg-[#204024] transition-colors shrink-0 tracking-wider">
                            <div className="w-3.5 h-3.5 border-[1.5px] border-white rounded-[3px] flex items-center justify-center"><span className="text-[10px] leading-none mb-[1px]">+</span></div> WRITE A REVIEW
                        </button>
                    </div>

                    {/* Aggregate Rating Box */}
                    <div className="bg-[#F6F4EE] border border-gray-200/60 rounded-2xl p-8 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_2fr] gap-10 items-center">
                        <div className="flex flex-col items-center justify-center md:border-r border-gray-200/60 h-full">
                            <span className="text-[5rem] font-serif font-black text-[#17301A] leading-[1] mb-2">4.8</span>
                            <div className="flex text-[#D9A528] mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <span className="text-[11px] text-gray-500 font-medium">Based on 1,284 verified batch purchases</span>
                        </div>

                        <div className="space-y-3.5 lg:pl-10">
                            {[
                                { s: "5 Stars", p: 88, w: "88%" },
                                { s: "4 Stars", p: 9, w: "9%" },
                                { s: "3 Stars", p: 2, w: "2%" },
                                { s: "2 Stars", p: 1, w: "1%" },
                                { s: "1 Stars", p: 0, w: "0%" }
                            ].map((bar) => (
                                <div key={bar.s} className="flex items-center gap-6 text-xs font-medium">
                                    <div className="w-16 shrink-0 text-[#17301A] font-bold">{bar.s}</div>
                                    <div className="flex-1 h-2 bg-[#EAE8E2] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#17301A] rounded-full" style={{ width: bar.w }}></div>
                                    </div>
                                    <div className="w-8 text-right text-gray-500 shrink-0 font-medium">{bar.w}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Review 1 */}
                        <div className="bg-white rounded-[1.25rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[14px] h-[14px] fill-current" />)}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium">August 14, 2024</span>
                            </div>
                            <h3 className="text-base font-serif font-bold text-[#17301A] mb-3 leading-snug">The cleanest cooking oil I have ever used in 20 years</h3>
                            <p className="text-[13px] text-gray-600 leading-relaxed mb-8">"You can immediately tell this is genuine wood-pressed oil. It has a beautiful gentle aroma of raw sunflower seeds, not the chemical neutrality of refined supermarket bottles. Food feels so much lighter on the stomach."</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#1F2937]">Kavita Sundaram</span>
                                        <span className="flex items-center gap-1 bg-[#F0F2F1] text-[#17301A] text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase"><CheckCircle2 className="w-2.5 h-2.5 text-[#17301A]" /> Verified</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">5L Can</span>
                                </div>
                                <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (42)</button>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white rounded-[1.25rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[14px] h-[14px] fill-current" />)}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium">July 28, 2024</span>
                            </div>
                            <h3 className="text-base font-serif font-bold text-[#17301A] mb-3 leading-snug">Verified lab reports gave me full confidence for my family</h3>
                            <p className="text-[13px] text-gray-600 leading-relaxed mb-8">"As a physician, checking the peroxide value and absence of mineral adulteration is crucial. EKAS publishing their actual NABL laboratory batch reports is unprecedented transparency. Excellent smoke point for Indian tadka."</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#1F2937]">Dr. Arvind Mehra</span>
                                        <span className="flex items-center gap-1 bg-[#F0F2F1] text-[#17301A] text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase"><CheckCircle2 className="w-2.5 h-2.5 text-[#17301A]" /> Verified</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">2L Bottle</span>
                                </div>
                                <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (38)</button>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white rounded-[1.25rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[14px] h-[14px] fill-current" />)}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium">July 19, 2024</span>
                            </div>
                            <h3 className="text-base font-serif font-bold text-[#17301A] mb-3 leading-snug">Crispiest snacks with zero heavy greasy residue</h3>
                            <p className="text-[13px] text-gray-600 leading-relaxed mb-8">"We tested making Gujarati snacks with this. The oil does not darken or smoke quickly, and the snacks retained their crunch for days without any sticky aftertaste. 10/10 recommend!"</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#1F2937]">Sneha Patel</span>
                                        <span className="flex items-center gap-1 bg-[#F0F2F1] text-[#17301A] text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase"><CheckCircle2 className="w-2.5 h-2.5 text-[#17301A]" /> Verified</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">1L Bottle</span>
                                </div>
                                <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (29)</button>
                            </div>
                        </div>

                        {/* Review 4 */}
                        <div className="bg-white rounded-[1.25rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[14px] h-[14px] fill-current" />)}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium">June 30, 2024</span>
                            </div>
                            <h3 className="text-base font-serif font-bold text-[#17301A] mb-3 leading-snug">Packaging and quality exceeded expectations</h3>
                            <p className="text-[13px] text-gray-600 leading-relaxed mb-8">"Shipped securely in sturdy eco-conscious packaging with no leaks. The glass bottle feels luxury and pours smoothly without dripping. Subscription set for every month!"</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#1F2937]">Rohit Shenoy</span>
                                        <span className="flex items-center gap-1 bg-[#F0F2F1] text-[#17301A] text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase"><CheckCircle2 className="w-2.5 h-2.5 text-[#17301A]" /> Verified</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">500ML Glass Bottle</span>
                                </div>
                                <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (17)</button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* RELATED PRODUCTS */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold font-serif text-[#1F2937]">You Might Also Like</h2>
                        <Link href="/product" className="text-xs font-bold text-[#2D5C35] hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {PRODUCTS.filter(p => p.id !== product.id).slice(0, 5).map((related, idx) => (
                            <ProductCard
                                key={related.id}
                                product={related}
                                index={idx}
                                onQuickView={() => {
                                    setQuickAddProduct(related);
                                    setQuickAddSizeIndex(0);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Add Modal */}
                {quickAddProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setQuickAddProduct(null)}>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setQuickAddProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex gap-4 mb-4">
                                <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                    <Image src={quickAddProduct.image} alt={quickAddProduct.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1F2937] leading-tight mb-1">{quickAddProduct.name}</h3>
                                    <p className="text-xs text-gray-500">{quickAddProduct.category}</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Size</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickAddProduct.sizes.map((size, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setQuickAddSizeIndex(idx)}
                                            className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all", quickAddSizeIndex === idx ? "border-[#2D5C35] bg-[#2D5C35] text-white" : "border-gray-200 text-gray-600 hover:border-[#2D5C35]")}
                                        >
                                            {size.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-2xl font-bold text-[#1F2937]">₹{quickAddProduct.sizes[quickAddSizeIndex].price}</span>
                                <button
                                    onClick={() => {
                                        const size = quickAddProduct.sizes[quickAddSizeIndex];
                                        addItem(quickAddProduct, 1, size.label, size.price);
                                        setQuickAddProduct(null);
                                    }}
                                    className="bg-[#1F2937] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#2D5C35] transition-all"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sticky Bottom Add To Cart Bar */}
                <div
                    className={cn(
                        "fixed bottom-0 left-0 right-0 bg-[#FBF9F4] border-t border-gray-200/60 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-40 transition-transform duration-300 ease-in-out px-4 py-3 md:px-8",
                        showStickyBar ? "translate-y-0" : "translate-y-full"
                    )}
                >
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
                        {/* Left: Product Info */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-lg shrink-0 hidden sm:flex shadow-sm">
                                E
                            </div>
                            <div className="w-12 h-12 bg-white rounded overflow-hidden shrink-0 border border-gray-200 relative shadow-sm">
                                <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                            </div>
                            <div className="hidden md:block">
                                <h4 className="text-[14px] font-bold text-[#1F2937] leading-none mb-1.5 flex items-center gap-2">
                                    {product.name} <span className="font-normal text-gray-400">•</span> {activeSize.label}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-black text-[#1F2937]">₹{activeSize.price}</span>
                                    {activeSize.originalPrice && (
                                        <span className="text-[12px] font-bold text-gray-400 line-through">₹{activeSize.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Middle: Size Selector */}
                        <div className="hidden lg:flex items-center gap-2">
                            {product.sizes.map((size, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSizeIndex(idx)}
                                    className={cn(
                                        "h-9 px-4 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-bold tracking-wide",
                                        selectedSizeIndex === idx
                                            ? "border-[1.5px] border-[#17301A] text-[#17301A]"
                                            : "border border-gray-300 bg-transparent text-gray-600 hover:border-gray-400"
                                    )}
                                >
                                    <span className="uppercase">{size.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-white border border-gray-300 rounded-full h-10 px-1 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-[#1F2937]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => {
                                    addItem(product, quantity, activeSize.label, activeSize.price);
                                    setQuantity(1);
                                }}
                                className="bg-[#17301A] hover:bg-[#204024] text-white text-[12px] font-bold uppercase tracking-widest px-6 h-10 rounded-full transition-colors flex items-center justify-center whitespace-nowrap shadow-sm"
                            >
                                Add to cart
                            </button>

                            {/* Buy Now Button */}
                            <button
                                onClick={() => {
                                    addItem(product, quantity, activeSize.label, activeSize.price);
                                    window.location.href = '/checkout';
                                }}
                                className="hidden sm:flex bg-[#D9A528] hover:bg-[#c4921f] text-[#17301A] text-[12px] font-bold uppercase tracking-widest px-6 h-10 rounded-full transition-colors items-center justify-center whitespace-nowrap shadow-sm"
                            >
                                Buy Now
                            </button>

                            {/* Wishlist Button */}
                            <button className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-500 shrink-0 shadow-sm">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
