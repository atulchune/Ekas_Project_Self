"use client";

import { useEffect, useRef } from "react";

export function TrustStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] relative z-20" style={{ marginTop: '-48px', marginBottom: '64px' }}>
      <div className="bg-white rounded-md py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        
        <div className="flex flex-1 items-center justify-center gap-5 group cursor-default">
          <div className="w-[46px] h-[46px] rounded-[12px] border border-[#B88A2A]/40 flex items-center justify-center text-[#956E1A] shrink-0">
            <span className="material-symbols-outlined font-light text-[22px]">eco</span>
          </div>
          <span className="font-label-caps text-[11px] font-bold text-[#3E3E3E] tracking-widest uppercase mt-0.5">WOOD PRESSED</span>
        </div>
        
        <div className="hidden md:block w-px h-10 bg-black/10"></div>
        
        <div className="flex flex-1 items-center justify-center gap-5 group cursor-default">
          <div className="w-[46px] h-[46px] rounded-[12px] border border-[#B88A2A]/40 flex items-center justify-center text-[#956E1A] shrink-0">
            <span className="material-symbols-outlined font-light text-[22px]">spa</span>
          </div>
          <span className="font-label-caps text-[11px] font-bold text-[#3E3E3E] tracking-widest uppercase mt-0.5">100% NATURAL</span>
        </div>
        
        <div className="hidden md:block w-px h-10 bg-black/10"></div>
        
        <div className="flex flex-1 items-center justify-center gap-5 group cursor-default">
          <div className="w-[46px] h-[46px] rounded-[12px] border border-[#B88A2A]/40 flex items-center justify-center text-[#956E1A] shrink-0">
            <span className="material-symbols-outlined font-light text-[22px]">science</span>
          </div>
          <span className="font-label-caps text-[11px] font-bold text-[#3E3E3E] tracking-widest uppercase mt-0.5">NO CHEMICALS</span>
        </div>
        
        <div className="hidden md:block w-px h-10 bg-black/10"></div>
        
        <div className="flex flex-1 items-center justify-center gap-5 group cursor-default">
          <div className="w-[46px] h-[46px] rounded-[12px] border border-[#B88A2A]/40 flex items-center justify-center text-[#956E1A] shrink-0">
            <span className="material-symbols-outlined font-light text-[22px]">handshake</span>
          </div>
          <span className="font-label-caps text-[11px] font-bold text-[#3E3E3E] tracking-widest uppercase mt-0.5">ETHICALLY SOURCED</span>
        </div>

      </div>
    </section>
  );
}
