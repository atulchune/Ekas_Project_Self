"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Minus, Plus, Heart, Share2, Maximize2, RefreshCw, CheckCircle2, Truck, Leaf, ThumbsUp, ArrowRight, X, ShieldCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductDetailVM } from "@/lib/mappers/product";

import OfferBand, { OFFERS } from "@/components/ui/OfferBand";
import OilFluid from "@/components/ui/OilFluid";

// Product-line showcase clips — decorative, keyed by slug like the hero art direction.
function getProductVideo(slug: string): string | null {
    if (slug.includes("coconut")) return "/videos/coconut.mp4";
    if (slug.includes("ghee")) return "/videos/ghee.mp4";
    if (slug.includes("mustard")) return "/videos/mustard.mp4";
    if (slug.includes("sunflower")) return "/videos/sunflower.mp4";
    return null;
}

export function ProductDetailClient({ product }: { product: ProductDetailVM }) {
    const productVideo = getProductVideo(product.slug);
    const defaultIndex = Math.max(0, product.variants.findIndex(v => v.isDefault));
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(defaultIndex === -1 ? 0 : defaultIndex);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { addItem } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    // FAQ state
    const [faqSearch, setFaqSearch] = useState("");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Sticky Bar state
    const [showStickyBar, setShowStickyBar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyBar(window.scrollY > 600);
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
        setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(1.8)" });
    };

    const handlePointerLeave = () => {
        setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
    };

    const variant = product.variants[selectedVariantIndex];
    const discount = variant?.originalPrice
        ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
        : 0;
    const saveAmount = variant?.originalPrice ? variant.originalPrice - variant.price : 0;

    const getPerLitrePrice = (): number | null => {
        if (!variant) return null;
        const label = variant.label.toLowerCase();
        let volumeMl: number | null = null;
        if (label.includes("ml")) {
            volumeMl = parseInt(label);
        } else if (label.includes("litre") || label.includes("l")) {
            volumeMl = parseInt(label.replace(/[^\d]/g, "")) * 1000;
        }
        if (volumeMl && volumeMl > 0) {
            return Math.round((variant.price / volumeMl) * 1000);
        }
        return null;
    };
    const perLitrePrice = getPerLitrePrice();

    const MARQUEE_TEXTS = [
        "WOOD-PRESSED", "NO PRESERVATIVES", "FSSAI LICENSED", "100% ORGANIC", "CHEMICAL FREE", "BATCH LAB TESTED", "COLD WOOD-PRESSED"
    ];

    const FAQS = [
        { q: "Why has my oil turned solid and white?", a: "Coconut oil sets below about 24°C. It is the clearest sign you have an unrefined oil — stand the bottle in warm water for a minute and it turns clear again. Never microwave it." },
        { q: "Can I deep fry in this?", a: "Yes, our wood-pressed oils have a high smoke point making them perfectly safe and healthy for deep frying." },
        { q: "Why does the colour differ from my last bottle?", a: "Because it is a natural, unrefined product. Minor variations in colour and aroma are expected and prove its authenticity." },
        { q: "How long does it keep after opening?", a: "It is best consumed within 6-12 months of opening. Keep it away from direct sunlight." },
        { q: "Can I use it on hair and skin?", a: "Absolutely. It is an excellent, natural moisturizer without any harsh chemicals." },
        { q: "What does the batch code on the cap tell me?", a: "It traces back to the exact week of harvest and the specific ghani pressing batch." }
    ];

    const filteredFaqs = FAQS.filter(faq => faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase()));

    const handleAddToCart = () => {
        if (!variant) return;
        addItem(variant.id, quantity);
    };

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
                        <Link href="/shop" className="hover:text-[#2D5C35] transition-colors">{product.categoryName ?? "Shop"}</Link>
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
                                            {product.gallery[activeImageIndex] ? (
                                                <Image
                                                    src={product.gallery[activeImageIndex]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-100 ease-out pointer-events-none"
                                                    style={zoomStyle}
                                                    priority
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">No image</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnails Row */}
                                {product.gallery.length > 1 && (
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
                                )}

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
                                    <span className="text-[#1F2937] font-bold ml-1.5 text-sm">{product.rating.toFixed(1)}</span>
                                </div>
                                <span className="underline decoration-dotted hover:text-[#2D5C35] cursor-pointer">{product.reviewCount} reviews</span>
                            </div>

                            {/* Title & Desc */}
                            <h1 className="text-3xl lg:text-4xl font-bold font-serif text-[#1F2937] leading-tight mb-2 tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4 max-w-xl line-clamp-3">
                                {product.description}
                            </p>

                            {/* Price */}
                            {variant && (
                                <div className="flex flex-col mb-4">
                                    <div className="flex items-end gap-3 mb-1">
                                        <span className="text-3xl font-bold text-[#1F2937]">₹{variant.price}</span>
                                        {variant.originalPrice && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through mb-1">₹{variant.originalPrice}</span>
                                                <span className="text-[10px] font-bold text-[#8C6D3F] bg-[#D9A528]/10 px-2 py-0.5 rounded-md mb-1.5">
                                                    Save ₹{saveAmount}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {perLitrePrice !== null && (
                                        <span className="text-[11px] text-gray-500 font-medium">₹{perLitrePrice} per litre - Inclusive of all taxes</span>
                                    )}
                                </div>
                            )}

                            {/* Size Selector */}
                            {product.variants.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SIZE</span>
                                        {variant && (
                                            <span className={cn(
                                                "text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full",
                                                variant.inStock ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"
                                            )}>
                                                <CheckCircle2 className="w-3 h-3" /> {variant.inStock ? "In stock" : "Out of stock"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 relative">
                                        {product.variants.map((v, idx) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariantIndex(idx)}
                                                disabled={!v.inStock}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-xl flex flex-col items-start justify-center border-2 transition-all duration-200 text-left disabled:opacity-40",
                                                    selectedVariantIndex === idx
                                                        ? "border-[#2D5C35] bg-[#2D5C35] text-white shadow-md shadow-green-900/10"
                                                        : "border-gray-200/70 bg-white text-gray-700 hover:border-[#2D5C35]/50"
                                                )}
                                            >
                                                <span className="text-sm font-bold block mb-0.5">{v.label}</span>
                                                <span className={cn("text-[11px]", selectedVariantIndex === idx ? "text-green-100" : "text-gray-500")}>
                                                    ₹{v.price}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 mb-4">
                                {/* Qty */}
                                <div className="flex items-center bg-white rounded-full border border-gray-200/80 px-2 h-12 shrink-0 shadow-sm overflow-hidden">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-[#2D5C35] transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-6 text-center font-bold text-[#1F2937]">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-[#2D5C35] transition-colors"><Plus className="w-4 h-4" /></button>
                                    {variant && (
                                        <div className="pl-3 pr-2 border-l border-gray-100 py-2 h-full flex items-center bg-gray-50/50">
                                            <span className="text-[11px] font-bold text-gray-500">₹{variant.price * quantity} total</span>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!variant?.inStock}
                                    className="flex-1 bg-[#2D5C35] text-white font-bold rounded-full h-12 shadow-lg shadow-green-900/20 hover:bg-[#1a3820] hover:shadow-green-900/30 transition-all flex items-center justify-center text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {variant?.inStock ? "ADD TO CART" : "SOLD OUT"}
                                </button>
                                <button
                                    onClick={() => toggleFavorite(product.slug)}
                                    className="w-12 h-12 bg-white rounded-full border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-[#2D5C35] hover:border-[#2D5C35]/50 transition-colors shrink-0 shadow-sm"
                                >
                                    <Heart className={cn("w-5 h-5", isFavorite(product.slug) && "fill-red-500 text-red-500")} />
                                </button>
                                <button className="w-12 h-12 bg-white rounded-full border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-[#2D5C35] hover:border-[#2D5C35]/50 transition-colors shrink-0 shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-3">
                                <div className="bg-[#f1efe8]/50 rounded-xl p-3 flex items-start gap-3 border border-gray-200/50">
                                    <Truck className="w-4 h-4 text-[#8C6D3F] shrink-0 mt-0.5" />
                                    <p className="text-[13px] text-[#1F2937] font-medium leading-relaxed">
                                        Free shipping on orders above ₹999. Cash on delivery available.
                                    </p>
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
            </div>

            {/* PRODUCT DOSSIER */}
            <div className="w-full px-4 md:px-8 xl:px-16 2xl:px-24 py-16">

                {product.features.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-12">
                            <div className="w-full relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900 flex items-center justify-center aspect-video lg:aspect-auto lg:min-h-[400px]">
                                {productVideo ? (
                                    <video
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={productVideo}
                                        controls
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : (
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&controls=1&rel=0"
                                        title="Product Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>

                            <div className="flex flex-col justify-center gap-8">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black font-sans text-[#1F2937] leading-tight mb-4 tracking-tight">
                                        One ingredient.<br />That&apos;s the whole list.
                                    </h2>
                                    <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                                        Most {(product.categoryName ?? "products").toLowerCase()} on a shelf has been through six processes you&apos;ll never see named. Ours has been through one — a traditional press — and the label has room to spare.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#F9F7F2] rounded-3xl transform translate-x-3 translate-y-3 border border-[#2D5C35]/10"></div>
                                    <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col sm:flex-row border border-gray-100">
                                        <div className="flex-1 p-6 sm:p-8 sm:pr-4">
                                            <h3 className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-6">TRAITS</h3>
                                            <ul className="space-y-4">
                                                {product.features.map((feature, i) => (
                                                    <li key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                                        <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Trait</span>
                                                        <span className="font-bold text-[#1F2937] text-right">{feature}</span>
                                                    </li>
                                                ))}
                                                {product.usage && (
                                                    <li className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                                        <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Usage</span>
                                                        <span className="font-bold text-[#1F2937] text-right truncate max-w-[150px]">{product.usage}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-200 my-10"></div>
                    </>
                )}

                {/* Nutrition Profile (only when the backend has data for it) */}
                {product.nutrition.length > 0 && (
                    <>
                        <div className="w-full bg-[#FDFCF8] rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden mb-16 flex flex-col lg:flex-row">
                            <div className="w-full bg-gradient-to-br from-[#17301A] to-[#204024] text-white p-8 lg:p-10 flex flex-col justify-center">
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold font-sans mb-2 tracking-tight text-white">Nutrition Profile</h2>
                                    <p className="text-[11px] text-gray-300 font-medium mb-8 leading-relaxed max-w-sm">
                                        Figures come from the batch report, not a generic table — per 100 g.
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6">
                                        {product.nutrition.map((nut, i) => (
                                            <div key={i} className="border-l-[2px] border-[#D9A528] pl-3 py-0.5">
                                                <div className="text-[22px] font-bold tracking-tight text-white mb-0.5">{nut.value}</div>
                                                <div className="text-[8px] font-bold text-[#D9A528] uppercase tracking-widest">{nut.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-200 my-10"></div>
                    </>
                )}

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
                                No questions found matching &quot;{faqSearch}&quot;
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* REVIEWS SECTION (static — real reviews wiring is a follow-up) */}
                <div className="w-full px-4 mb-20">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-10">
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-4 block">REVIEWS</span>
                            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-[#17301A] mb-4 tracking-tight">
                                {product.reviewCount > 0 ? `${product.reviewCount} reviews so far` : "Be the first to review"}
                            </h2>

                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-5xl font-black text-[#1F2937] leading-none">{product.rating.toFixed(1)}</span>
                                <div>
                                    <div className="flex text-[#D9A528] mb-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.reviewCount === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <ThumbsUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No reviews yet for this product.</p>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-10"></div>

                {/* RELATED PRODUCTS */}
                {product.relatedProducts.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-serif text-[#1F2937]">You Might Also Like</h2>
                            <Link href="/shop" className="text-xs font-bold text-[#2D5C35] hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {product.relatedProducts.map((related, idx) => (
                                <ProductCard key={related.id} product={related} index={idx} />
                            ))}
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
                                {product.gallery[0] && <Image src={product.gallery[0]} alt={product.name} fill className="object-cover" />}
                            </div>
                            {variant && (
                                <div className="hidden sm:block">
                                    <h4 className="text-[13px] font-bold text-[#1F2937] leading-none mb-1.5">
                                        {product.name} <span className="mx-1 font-normal text-gray-400">•</span> {variant.label}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-[#1F2937]">₹{variant.price}</span>
                                        {variant.originalPrice && (
                                            <span className="text-xs font-bold text-gray-400 line-through">₹{variant.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
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

                            <button
                                onClick={() => {
                                    handleAddToCart();
                                    setQuantity(1);
                                }}
                                disabled={!variant?.inStock}
                                className="bg-[#17301A] hover:bg-[#1a381e] text-white text-[11px] font-bold uppercase tracking-widest px-8 h-10 rounded-full transition-colors flex items-center justify-center shadow-md disabled:opacity-40"
                            >
                                Add to cart
                            </button>

                            <button
                                onClick={() => toggleFavorite(product.slug)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-500 shrink-0 shadow-sm"
                            >
                                <Heart className={cn("w-4 h-4", isFavorite(product.slug) && "fill-red-500 text-red-500")} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
