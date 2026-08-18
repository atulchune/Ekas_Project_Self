import Link from "next/link";
import Image from "next/image";

export function WomenStory() {
    // Curated high-quality Unsplash portraits of Indian women for the demo
    const images1 = [
        "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
    ];
    
    const images2 = [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
    ];

    const images3 = [
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop"
    ];

    return (
        <section className="bg-[#17301A] text-white py-12 md:py-16 overflow-hidden relative border-t border-white/5">
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes scrollUp {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    @keyframes scrollDown {
                        0% { transform: translateY(-50%); }
                        100% { transform: translateY(0); }
                    }
                    .animate-scroll-up { animation: scrollUp 40s linear infinite; }
                    .animate-scroll-down { animation: scrollDown 40s linear infinite; }
                `
            }} />
            
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    
                    {/* Left: Images with Scrolling Animation */}
                    <div className="w-full lg:w-[45%] h-[350px] md:h-[450px] relative overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                        
                        {/* Top Badge Overlay */}
                        <div className="absolute left-4 top-4 z-20 bg-[#17301A]/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#D9A528]/30 shadow-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A528]"></span>
                            <span className="text-[8px] font-bold text-[#D9A528] tracking-widest uppercase">180 WOMEN • 24 VILLAGES</span>
                        </div>

                        {/* Testimonial Card Overlay */}
                        <div className="absolute left-4 bottom-4 z-20 bg-[#17301A]/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl max-w-[260px]">
                            <span className="text-[#D9A528] text-xl font-serif leading-none absolute top-2 left-3">"</span>
                            <p className="text-xs leading-relaxed text-gray-200 mb-3 relative z-10 pt-2">
                                I used to wait for the season to earn. Now I earn every month, and my daughter is in school.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#D9A528]/50">
                                    <Image src={images1[0]} alt="Kusum Shukla" width={32} height={32} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-white leading-tight">Kusum Shukla</h4>
                                    <p className="text-[8px] text-gray-400">Packing lead</p>
                                </div>
                            </div>
                        </div>

                        {/* Scrolling Background Container */}
                        <div className="absolute inset-[-50px] flex gap-3 transform rotate-[6deg] scale-[1.1]">
                            
                            {/* Column 1 (Scroll Down) */}
                            <div className="flex-1 flex flex-col gap-3 animate-scroll-down h-[200%]">
                                {[...images1, ...images1].map((src, i) => (
                                    <div key={i} className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#D9A528]/10 shrink-0">
                                        <Image src={src} alt="Woman worker" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Column 2 (Scroll Up) */}
                            <div className="flex-1 flex flex-col gap-3 animate-scroll-up h-[200%] mt-[-30%]">
                                {[...images2, ...images2].map((src, i) => (
                                    <div key={i} className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#D9A528]/10 shrink-0">
                                        <Image src={src} alt="Woman worker" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Column 3 (Scroll Down) */}
                            <div className="flex-1 flex flex-col gap-3 animate-scroll-down h-[200%] mt-[-15%]">
                                {[...images3, ...images3].map((src, i) => (
                                    <div key={i} className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#D9A528]/10 shrink-0">
                                        <Image src={src} alt="Woman worker" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>

                        </div>
                        
                        {/* Overlay Gradient to soften edges */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#17301A]/40 via-transparent to-[#17301A]/40 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[#17301A]/10 pointer-events-none mix-blend-overlay"></div>
                    </div>

                    {/* Right: Content */}
                    <div className="w-full lg:w-[55%] lg:pl-4">
                        <span className="text-[9px] font-bold text-[#D9A528] uppercase tracking-widest block mb-2">WOMEN-LED</span>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-serif font-bold text-white mb-4 leading-tight tracking-tight">
                            The women <br /> behind EKAS
                        </h2>
                        
                        <p className="text-sm text-gray-300 leading-relaxed mb-8 max-w-xl">
                            EKAS exists because a group of women in Daman wanted year-round work without leaving their village. They press, filter, fill and seal every bottle — and a share of each batch goes back to them. Buying a bottle is the whole point.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-t border-white/10 pt-6">
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">24</h3>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">VILLAGES</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">180+</h3>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">WOMEN EMPLOYED</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">640+</h3>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">FAMILIES SUPPORTED</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">1200+</h3>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">BATCHES TRACED</p>
                            </div>
                        </div>

                        <Link 
                            href="/our-story" 
                            className="inline-block px-8 py-3 rounded-full border border-gray-400 text-white text-[10px] font-bold uppercase tracking-widest hover:border-white hover:bg-white hover:text-[#17301A] transition-all"
                        >
                            READ THEIR STORY &nbsp;&rarr;
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
