"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function FinalCTA() {
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
    <section className="bg-surface-variant min-h-[50vh] flex flex-col items-center justify-center py-16 border-y border-secondary/20">
      <div className="max-w-3xl mx-auto px-[var(--spacing-margin-mobile)] text-center flex flex-col items-center justify-center h-full">
        <span 
          className="material-symbols-outlined text-secondary text-4xl mb-6" 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          water_drop
        </span>
        <h2 className="font-display-lg-mobile md:font-display-lg text-[length:var(--text-display-lg-mobile)] md:text-[length:var(--text-display-lg)] text-primary mb-8 leading-tight">
          BRING PURENESS HOME.
        </h2>
        <p className="font-body-lg text-[length:var(--text-body-lg)] text-on-surface-variant mb-12">
          Experience the difference of oils crafted without compromise. Join the EKAS family and elevate your everyday cooking to an act of wellness.
        </p>
        <Link href="/shop" className="inline-block bg-primary-container text-on-primary font-label-caps text-[length:var(--text-label-caps)] font-semibold uppercase tracking-widest px-10 py-5 rounded hover:bg-primary transition-colors shadow-sm hover:shadow-md hover:-translate-y-1 transform duration-300">
          SHOP THE FULL COLLECTION
        </Link>
      </div>
    </section>
  );
}
