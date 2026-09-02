"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Minus, Plus, Heart, Share2, Maximize2, RefreshCw, CheckCircle2, ChevronRight, Truck, Info, Leaf, ThumbsUp, ChevronDown, ArrowRight, X, ShieldCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ui/ProductCard";
import dynamic from "next/dynamic";

import OfferBand, { OFFERS } from "@/components/ui/OfferBand";

import OilFluid from "@/components/ui/OilFluid";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = PRODUCTS.find(p => p.id === id);

    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { addItem } = useCart();

    // Quick add modal state
    const [quickAddProduct, setQuickAddProduct] = useState<typeof PRODUCTS[0] | null>(null);
    const [quickAddSizeIndex, setQuickAddSizeIndex] = useState(0);

    // FAQ state
    const [faqSearch, setFaqSearch] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Sticky Bar state
    const [showStickyBar, setShowStickyBar] = useState(false);

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
            <OilFluid />
            {/* Offer Band below Navbar */}
            <div className="pt-20 lg:pt-[84px]">
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

                                    {/* Image with Zoom effect */}
                                    <div
                                        className="absolute inset-0 w-full h-full cursor-zoom-in"
                                        onPointerMove={handlePointerMove}
                                        onPointerLeave={handlePointerLeave}
                                    >
                                        <div className="relative w-full h-full overflow-hidden rounded-3xl">
                                            <Image
                                                src={product.gallery[activeImageIndex] || product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-100 ease-out pointer-events-none"
                                                style={zoomStyle}
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnails Row */}
                                <div className="grid grid-cols-5 gap-3">
                                    {product.gallery.map((img, i) => (
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
                                                <Image src={img} alt="" fill className="object-cover" />
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
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SIZE</span>
                                    <span className="text-xs text-green-700 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> In stock</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3 relative">
                                    {product.sizes.map((size, idx) => (
                                        <div key={idx} className="relative">
                                            {/* Dynamic tags based on index */}
                                            {idx === 1 && (
                                                <span className="absolute -top-2.5 right-2 bg-[#8C6D3F] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10 shadow-sm whitespace-nowrap">
                                                    Most Bought
                                                </span>
                                            )}
                                            {idx === 2 && (
                                                <span className="absolute -top-2.5 right-2 bg-[#1F2937] text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10 shadow-sm whitespace-nowrap">
                                                    Best Value
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setSelectedSizeIndex(idx)}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-xl flex flex-col items-start justify-center border-2 transition-all duration-200 text-left",
                                                    selectedSizeIndex === idx
                                                        ? "border-[#2D5C35] bg-[#2D5C35] text-white shadow-md shadow-green-900/10"
                                                        : "border-gray-200/70 bg-white text-gray-700 hover:border-[#2D5C35]/50"
                                                )}
                                            >
                                                <span className="text-sm font-bold block mb-0.5">{size.label}</span>
                                                <span className={cn("text-[11px]", selectedSizeIndex === idx ? "text-green-100" : "text-gray-500")}>
                                                    ₹{size.price}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subscribe Box */}
                            <div className="bg-white rounded-xl p-3 border border-gray-200/70 shadow-sm mb-4 flex items-start gap-3 cursor-pointer hover:border-[#2D5C35]/30 transition-colors">
                                <input type="checkbox" className="mt-1 w-4 h-4 rounded text-[#2D5C35] border-gray-300 focus:ring-[#2D5C35]" />
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-[#1F2937]">Subscribe & save 10%</span>
                                        <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider">Most Households</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500">A fresh bottle every 6 weeks, pressed to order. Pause or cancel any time.</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mb-4">
                                {/* Qty */}
                                <div className="flex items-center bg-white rounded-full border border-gray-200/80 px-2 h-12 shrink-0 shadow-sm overflow-hidden">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-[#2D5C35] transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-6 text-center font-bold text-[#1F2937]">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-[#2D5C35] transition-colors"><Plus className="w-4 h-4" /></button>
                                    <div className="pl-3 pr-2 border-l border-gray-100 py-2 h-full flex items-center bg-gray-50/50">
                                        <span className="text-[11px] font-bold text-gray-500">₹{activeSize.price * quantity} total</span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <button
                                    onClick={() => addItem(product, quantity, activeSize.label, activeSize.price)}
                                    className="flex-1 bg-[#2D5C35] text-white font-bold rounded-full h-12 shadow-lg shadow-green-900/20 hover:bg-[#1a3820] hover:shadow-green-900/30 transition-all flex items-center justify-center text-sm tracking-wide"
                                >
                                    ADD TO CART
                                </button>
                                <button className="flex-1 bg-[#F9F7F2] text-[#2D5C35] border-2 border-[#2D5C35] font-bold rounded-full h-12 hover:bg-[#2D5C35] hover:text-white transition-all flex items-center justify-center text-sm tracking-wide">
                                    BUY NOW
                                </button>
                                <button className="w-12 h-12 bg-white rounded-full border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-[#2D5C35] hover:border-[#2D5C35]/50 transition-colors shrink-0 shadow-sm">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="w-12 h-12 bg-white rounded-full border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-[#2D5C35] hover:border-[#2D5C35]/50 transition-colors shrink-0 shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Delivery & Stock Info */}
                            <div className="space-y-3">
                                <div className="bg-[#f1efe8]/50 rounded-xl p-3 flex items-start gap-3 border border-gray-200/50">
                                    <Truck className="w-4 h-4 text-[#8C6D3F] shrink-0 mt-0.5" />
                                    <p className="text-[13px] text-[#1F2937] font-medium leading-relaxed">
                                        Arrives <span className="font-bold">Thu, 6 Aug</span> to 400001 — order in the next 4 hours and it presses tomorrow.
                                    </p>
                                </div>
                                <div className="px-1 pt-2">
                                    <div className="flex justify-between items-end mb-2 text-[11px] font-bold">
                                        <span className="text-[#8C6D3F]">Only 34 bottles left from this press</span>
                                        <span className="text-gray-400">Next press Tuesday</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#8C6D3F] w-[85%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

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

                {/* Dossier Section 1: One ingredient list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-12">
                    {/* Left: YouTube Video */}
                    <div className="w-full relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900 flex items-center justify-center aspect-video lg:aspect-auto lg:min-h-[400px]">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&controls=1&rel=0"
                            title="Product Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Right: Text and Comparison Widget */}
                    <div className="flex flex-col justify-center gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black font-sans text-[#1F2937] leading-tight mb-4 tracking-tight">
                                One ingredient.<br />That's the whole list.
                            </h2>
                            <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                                Most {product.category.toLowerCase()} on a shelf has been through six processes you'll never see named. Ours has been through one — a traditional press — and the label has room to spare.
                            </p>
                        </div>

                        {/* Comparison Widget */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#F9F7F2] rounded-3xl transform translate-x-3 translate-y-3 border border-[#2D5C35]/10"></div>
                            <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col sm:flex-row border border-gray-100">
                                {/* What's In It */}
                                <div className="flex-1 p-6 sm:p-8 sm:pr-4">
                                    <h3 className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-6">INGREDIENT 1 OF 1 — PURE</h3>
                                    <ul className="space-y-4">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                                <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Trait</span>
                                                <span className="font-bold text-[#1F2937] text-right">{feature}</span>
                                            </li>
                                        ))}
                                        <li className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                            <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Usage</span>
                                            <span className="font-bold text-[#1F2937] text-right truncate max-w-[150px]">{product.usage}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* What Isn't In It (Dark) */}
                                <div className="flex-1 bg-[#17301A] p-6 sm:p-8 sm:pl-6 text-white">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">AND WHAT ISN'T IN IT</h3>
                                    <ul className="space-y-4">
                                        <li className="flex justify-between items-center text-sm border-b border-[#2D5C35] pb-3">
                                            <span className="font-bold text-gray-300 line-through decoration-red-400/70">Hexane</span>
                                            <span className="text-gray-400 text-xs">Solvent extraction</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm border-b border-[#2D5C35] pb-3">
                                            <span className="font-bold text-gray-300 line-through decoration-red-400/70">Bleaching earth</span>
                                            <span className="text-gray-400 text-xs">Colour correction</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm border-b border-[#2D5C35] pb-3">
                                            <span className="font-bold text-gray-300 line-through decoration-red-400/70">Deodorisers</span>
                                            <span className="text-gray-400 text-xs">Aroma removal</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm border-b border-[#2D5C35] pb-3">
                                            <span className="font-bold text-gray-300 line-through decoration-red-400/70">TBHQ / BHA</span>
                                            <span className="text-gray-400 text-xs">Synthetic antioxidants</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* Dossier Section 2: Timeline / Process */}
                <div className="mb-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-black font-sans text-[#1F2937] leading-tight mb-3 tracking-tight">
                            From farm to your cupboard
                        </h2>
                        <p className="text-sm text-gray-600 font-medium max-w-3xl">
                            Every stage is done by a named person in our partner villages. The batch code on the cap resolves to this exact sequence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-gray-100 z-0"></div>

                        {[
                            { day: "DAY 1", title: "Harvested at the source", desc: "Premium raw materials picked ripe rather than early — quality matters more than weight. Sourced from local farming families." },
                            { day: "DAY 2–6", title: "Sun-dried naturally", desc: "Laid on woven mats for five days. No kiln, because kiln heat is the first thing that dulls the aroma. Village drying yard." },
                            { day: "DAY 7", title: "Cleaned and sorted by hand", desc: "Every piece checked for mould and grit. Only the best grade goes to the press." },
                            { day: "DAY 8", title: "Crushed in the wooden ghani", desc: "A slow turning mortar. The paste never climbs past 42°C, which is the whole reason to do it this way." },
                            { day: "DAY 9–11", title: "Settled and Sealed", desc: "Standing still in steel. Sediment falls out under its own weight — no filter press. Tested, filled in amber glass, and sealed." }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col pt-0 group">
                                <div className="flex md:flex-col items-start gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-sm shrink-0 border-4 border-white shadow-sm transition-colors group-hover:bg-[#2D5C35]">
                                        {i + 1}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest md:mt-2 self-center md:self-start">{step.day}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#1F2937] mb-1.5 leading-snug">{step.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dossier Section 3: Nutrition & Highlights Poster */}
                <div className="w-full bg-[#FDFCF8] rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden mb-16 flex flex-col lg:flex-row">

                    {/* Left: Highlights (2x2 Grid) */}
                    <div className="flex-1 p-8 lg:p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold font-sans text-[#17301A] tracking-tight">Nutrient Highlights</h2>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                            {product.healthHighlights?.map((item, i) => (
                                <div key={i}>
                                    <h4 className="text-[11px] font-bold text-[#2D5C35] mb-1.5 uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Nutrition Profile */}
                    <div className="w-full lg:w-[500px] xl:w-[550px] bg-gradient-to-br from-[#17301A] to-[#204024] text-white p-8 lg:p-10 flex flex-col justify-center">
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold font-sans mb-2 tracking-tight text-white">Nutrition Profile</h2>
                            <p className="text-[11px] text-gray-300 font-medium mb-8 leading-relaxed max-w-sm">
                                Figures come from the batch report, not a generic table — per 100 g.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6">
                                {product.nutrition?.map((nut, i) => (
                                    <div key={i} className="border-l-[2px] border-[#D9A528] pl-3 py-0.5">
                                        <div className="text-[22px] font-bold tracking-tight text-white mb-0.5">{nut.value}</div>
                                        <div className="text-[8px] font-bold text-[#D9A528] uppercase tracking-widest">{nut.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

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

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* REVIEWS SECTION */}
                <div className="w-full px-4 mb-20">
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-10">
                        {/* Left Side: Rating Summary */}
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-4 block">REVIEWS</span>
                            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-[#17301A] mb-4 tracking-tight">318 kitchens, mostly happy</h2>

                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-5xl font-black text-[#1F2937] leading-none">4.9</span>
                                <div>
                                    <div className="flex text-[#D9A528] mb-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">94% would buy again</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {[{ t: "Authentic aroma", c: 141 }, { t: "Tastes like home", c: 96 }, { t: "Traceable batch", c: 58 }, { t: "Premium price", c: 22 }].map((tag, i) => (
                                    <span key={i} className="bg-gray-100/80 border border-gray-200/50 text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-full">
                                        {tag.t} <span className="text-gray-400 font-normal ml-1">{tag.c}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Rating Bars */}
                        <div className="w-full lg:w-[400px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm shrink-0">
                            <div className="space-y-3">
                                {[
                                    { s: "5", p: 87 },
                                    { s: "4", p: 9 },
                                    { s: "3", p: 3 },
                                    { s: "2", p: 1 },
                                    { s: "1", p: 0 }
                                ].map((bar) => (
                                    <div key={bar.s} className="flex items-center gap-4 text-xs font-medium">
                                        <div className="flex items-center gap-1 w-6 shrink-0 text-gray-600">{bar.s} <Star className="w-3 h-3 fill-current text-gray-400" /></div>
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#17301A] to-[#8C6D3F] rounded-full" style={{ width: `${bar.p}%` }}></div>
                                        </div>
                                        <div className="w-8 text-right text-gray-400 shrink-0">{bar.p}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <button className="bg-[#17301A] text-white text-[11px] font-bold px-4 py-2 rounded-full border border-[#17301A]">All 318</button>
                        <button className="bg-white text-gray-600 text-[11px] font-bold px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">5 star</button>
                        <button className="bg-white text-gray-600 text-[11px] font-bold px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">With photos</button>
                        <button className="bg-white text-gray-600 text-[11px] font-bold px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">Verified only</button>
                    </div>

                    {/* Reviews Masonry */}
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                        {/* Review 1 */}
                        <div className="break-inside-avoid bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4 relative hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[10px] h-[10px] fill-current" />)}
                                </div>
                                <span className="text-[8px] font-bold text-[#17301A] flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 className="w-[10px] h-[10px]" /> VERIFIED</span>
                            </div>
                            <h3 className="text-[13px] font-bold text-[#1F2937] mb-1.5 leading-snug">Smells like my grandmother's kitchen</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed mb-3">I grew up in Kollam and stopped buying coconut oil in Mumbai because it smelled of nothing. This one I opened and immediately recognised. The thoran tasted right for the first time in years.</p>
                            <div className="flex gap-2 mb-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-[7px] text-gray-400 font-bold overflow-hidden relative cursor-pointer"><span className="z-10 text-center leading-tight opacity-50">photo<br />or<br />browse</span></div>
                                <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-[7px] text-gray-400 font-bold overflow-hidden relative cursor-pointer"><span className="z-10 text-center leading-tight opacity-50">photo<br />or<br />browse</span></div>
                            </div>
                            <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-50">
                                <span className="text-[9px] text-gray-400 font-medium">Anjali R. - Mumbai</span>
                                <button className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-1 rounded-md transition-colors"><ThumbsUp className="w-2.5 h-2.5" /> 34</button>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="break-inside-avoid bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4 relative hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[10px] h-[10px] fill-current" />)}
                                </div>
                                <span className="text-[8px] font-bold text-[#17301A] flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 className="w-[10px] h-[10px]" /> VERIFIED</span>
                            </div>
                            <h3 className="text-[13px] font-bold text-[#1F2937] mb-1.5 leading-snug">Solidified and I panicked — then read the label</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed mb-3">Turned solid white in December and I thought it had gone bad. Support explained that is what unrefined oil does below 24°C. Stood it in warm water, perfectly fine. Would suggest putting that on the front.</p>
                            <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-50">
                                <span className="text-[9px] text-gray-400 font-medium">Vikram S. - Pune</span>
                                <button className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-1 rounded-md transition-colors"><ThumbsUp className="w-2.5 h-2.5" /> 61</button>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="break-inside-avoid bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4 relative hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex text-[#D9A528] relative">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[10px] h-[10px] fill-current opacity-30" />)}
                                    <div className="absolute top-0 left-0 flex text-[#D9A528]"><Star className="w-[10px] h-[10px] fill-current" /><Star className="w-[10px] h-[10px] fill-current" /><Star className="w-[10px] h-[10px] fill-current" /><Star className="w-[10px] h-[10px] fill-current" /></div>
                                </div>
                                <span className="text-[8px] font-bold text-[#17301A] flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 className="w-[10px] h-[10px]" /> VERIFIED</span>
                            </div>
                            <h3 className="text-[13px] font-bold text-[#1F2937] mb-1.5 leading-snug">Excellent oil, wish the 1 L was cheaper</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed mb-3">No complaints on quality at all — you can taste the difference against the refined bottle sitting next to it. Four stars only because at this price it is a considered purchase, not a default one.</p>
                            <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-50">
                                <span className="text-[9px] text-gray-400 font-medium">Meera K. - Bengaluru</span>
                                <button className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-1 rounded-md transition-colors"><ThumbsUp className="w-2.5 h-2.5" /> 18</button>
                            </div>
                        </div>

                        {/* Review 4 */}
                        <div className="break-inside-avoid bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4 relative hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex text-[#D9A528]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-[10px] h-[10px] fill-current" />)}
                                </div>
                                <span className="text-[8px] font-bold text-[#17301A] flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 className="w-[10px] h-[10px]" /> VERIFIED</span>
                            </div>
                            <h3 className="text-[13px] font-bold text-[#1F2937] mb-1.5 leading-snug">Scanned the batch code out of curiosity</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed mb-3">It actually worked. Showed the press date, the settling window and a name — Kusum. I did not expect a small brand to follow through on that. Bought two more as gifts.</p>
                            <div className="flex gap-2 mb-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-[7px] text-gray-400 font-bold overflow-hidden relative cursor-pointer"><span className="z-10 text-center leading-tight opacity-50">photo<br />or<br />browse</span></div>
                                <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-[7px] text-gray-400 font-bold overflow-hidden relative cursor-pointer"><span className="z-10 text-center leading-tight opacity-50">photo<br />or<br />browse</span></div>
                            </div>
                            <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-50">
                                <span className="text-[9px] text-gray-400 font-medium">Farhan A. - Hyderabad</span>
                                <button className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-1 rounded-md transition-colors"><ThumbsUp className="w-2.5 h-2.5" /> 47</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button className="text-[11px] font-bold text-[#1F2937] tracking-widest uppercase px-8 py-3 rounded-full border border-gray-300 hover:border-[#1F2937] hover:bg-[#1F2937] hover:text-white transition-all">
                            READ ALL 318 REVIEWS
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* RELATED PRODUCTS */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold font-serif text-[#1F2937]">You Might Also Like</h2>
                        <Link href="/shop" className="text-xs font-bold text-[#2D5C35] hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {PRODUCTS.filter(p => p.id !== product.id).slice(0, 5).map((related, idx) => (
                            <ProductCard key={related.id} product={related} index={idx} />
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
                        "fixed bottom-0 left-0 right-0 bg-[#F9F7F2] border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 transition-transform duration-300 ease-in-out px-4 py-3 md:px-8",
                        showStickyBar ? "translate-y-0" : "translate-y-full"
                    )}
                >
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
                        {/* Left: Product Info */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div className="hidden sm:block">
                                <h4 className="text-[13px] font-bold text-[#1F2937] leading-none mb-1.5">
                                    {product.name} <span className="mx-1 font-normal text-gray-400">•</span> {activeSize.label}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-[#1F2937]">₹{activeSize.price}</span>
                                    {activeSize.originalPrice && (
                                        <span className="text-xs font-bold text-gray-400 line-through">₹{activeSize.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Quantity Selector */}
                            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full h-10 px-1 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-50"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-[#1F2937]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-50"
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
                                className="bg-[#17301A] hover:bg-[#1a381e] text-white text-[11px] font-bold uppercase tracking-widest px-8 h-10 rounded-full transition-colors flex items-center justify-center shadow-md"
                            >
                                Add to cart
                            </button>

                            {/* Wishlist Button */}
                            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-500 shrink-0 shadow-sm">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
