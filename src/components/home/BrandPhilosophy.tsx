"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function BrandPhilosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // From parsed-assets.json
  const philosophyVideo = "https://ekas-assets.triodesolutions.com/homepage-assets/EKAS_Homepage_01_Hero_OilDrop.mp4";

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
    <section ref={sectionRef} className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-0 reveal-section min-h-[calc(100vh-80px)] flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)] items-center w-full">
        <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-12 py-12">
          <span className="font-label-caps text-[length:var(--text-label-caps)] font-semibold text-secondary mb-6 tracking-widest uppercase animate-shimmer">
            Our Philosophy
          </span>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-[length:var(--text-headline-lg-mobile)] md:text-[length:var(--text-headline-lg)] text-primary mb-8 text-balance">
            FOOD, RETURNED TO ITS PUREST FORM.
          </h2>
          <p className="font-body-md text-[length:var(--text-body-md)] text-on-surface-variant mb-6">
            We believe that true luxury lies in uncompromised purity. Inspired by ancestral Indian wisdom, EKAS is a tribute to slow living and mindful consumption.
          </p>
          <p className="font-body-md text-[length:var(--text-body-md)] text-on-surface-variant mb-12">
            Every drop of our oil is extracted using traditional wooden Ghani methods—ensuring no heat, no chemicals, and no rushing the process. Just nature's finest, exactly as it was meant to be.
          </p>
          <Link href="/our-story" className="font-label-caps text-[length:var(--text-label-caps)] font-semibold uppercase tracking-widest text-primary border border-secondary/40 px-8 py-4 rounded hover:bg-secondary/5 transition-colors">
            DISCOVER OUR STORY
          </Link>
        </div>

        <div className="md:col-span-7 mt-12 md:mt-0 relative h-full min-h-[50vh] md:min-h-[calc(100vh-80px)] w-full">
          {/* Decorative subtle frame */}
          {/* <div className="absolute inset-y-8 -inset-x-4 border border-secondary/20 rounded hidden md:block transform translate-x-4 translate-y-0 animate-shimmer z-0"></div> */}

          <div className="w-full h-full md:absolute md:inset-0 rounded overflow-hidden shadow-sm z-10 bg-surface-container">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src={philosophyVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
