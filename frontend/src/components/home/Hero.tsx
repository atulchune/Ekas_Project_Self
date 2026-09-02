"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { getAssetUrl } from "@/lib/getAsset";

export function Hero() {
  const heroVideo = getAssetUrl("EKAS_Homepage_02_Hero_OilBubbles.mp4");
  const heroPoster = getAssetUrl("EKAS_Homepage_03_ProductRange.png");

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-[calc(100vh-80px)] border-b border-secondary/20">
      {/* Left: Cinematic Video */}
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-full overflow-hidden group">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          poster={heroPoster}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/0 pointer-events-none"></div>

        {/* Toggle Sound Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full border border-white/50 backdrop-blur-sm bg-black/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/80 hover:bg-black/40 z-10"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isMuted ? "volume_off" : "volume_up"}
          </span>
        </button>
      </div>

      {/* Right: Diwali Campaign / Main Hero Copy */}
      <div className="w-full md:w-1/2 bg-surface-container-low flex flex-col justify-center items-start px-[var(--spacing-margin-mobile)] py-12 md:p-[var(--spacing-margin-desktop)] relative overflow-hidden h-[50vh] md:h-full">
        {/* Subtle botanical accent */}
        <div className="absolute top-10 right-10 opacity-20 pointer-events-none animate-shimmer">
          <svg className="text-secondary" fill="none" height="120" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 24 24" width="120">
            <path d="M12 2C12 2 15 6 15 11C15 16 12 22 12 22C12 22 9 16 9 11C9 6 12 2 12 2Z"></path>
            <path d="M12 22C12 22 17 18 19 13C21 8 18 4 18 4C18 4 16 8 13.5 11"></path>
            <path d="M12 22C12 22 7 18 5 13C3 8 6 4 6 4C6 4 8 8 10.5 11"></path>
          </svg>
        </div>

        <span className="font-label-caps text-[length:var(--text-label-caps)] text-secondary mb-4 md:mb-6 tracking-[0.2em] relative inline-block animate-shimmer uppercase font-semibold">
          FESTIVE SPECIAL
          <span className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-secondary/50"></span>
        </span>

        <h1 className="font-display-lg-mobile md:font-display-lg text-[length:var(--text-display-lg-mobile)] md:text-[length:var(--text-display-lg)] text-primary mb-4 md:mb-8 max-w-xl leading-tight text-balance">
          PURE GOODNESS,<br />MADE FOR EVERY<br />CELEBRATION.
        </h1>

        <p className="font-body-md text-[length:var(--text-body-md)] text-on-surface-variant mb-8 md:mb-12 max-w-md">
          Honor the season with ingredients rooted in tradition. Discover our limited edition curations crafted for festive feasts.
        </p>

        <Link href="/shop" className="group inline-flex items-center font-label-caps text-[length:var(--text-label-caps)] text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors duration-300 uppercase font-semibold tracking-widest">
          SHOP THE OFFER
          <span className="material-symbols-outlined ml-2 transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
