"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";

export function Heritage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heritageImage = "/images/EKAS_Homepage_07_Heritage.png";

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
    <section ref={sectionRef} className="bg-background py-24 md:py-32 reveal-section">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left Side: Brand Story Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-full overflow-hidden shadow-sm relative">
              <Image
                alt="Founder in a soulful Indian kitchen"
                src={heritageImage}
                fill
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative accent */}
            {/* <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-secondary/20 rounded-full animate-shimmer hidden md:block"></div> */}
          </div>

          {/* Right Side: Story Content */}
          <div className="flex flex-col">
            <span className="font-label-caps text-[length:var(--text-label-caps)] font-semibold text-secondary mb-6 tracking-widest uppercase">
              Our Heritage
            </span>
            <h2 className="font-headline-lg-mobile md:text-5xl text-primary-container mb-8 leading-tight font-headline-lg">
              A Woman-Led Kitchen, Grown Into a Brand
            </h2>

            <div className="space-y-6">
              <p className="font-body-lg text-[length:var(--text-body-lg)] text-[#24231F] leading-relaxed">
                EKAS began in a small home kitchen, where our founder sought to preserve the purity of ancestral Indian food practices. What started as a personal quest for unadulterated, wood-pressed oils and hand-churned ghee soon evolved into a mission to share this soul-nourishing wisdom with the world.
              </p>
              <p className="font-body-lg text-[length:var(--text-body-lg)] text-[#24231F] leading-relaxed">
                Today, we stand as a testament to the power of traditional craftsmanship and female entrepreneurship. Every bottle of EKAS is a tribute to the slow, mindful processes that respect both the ingredient and the consumer, ensuring that every drop remains as pure as nature intended.
              </p>
            </div>

            <div className="mt-12">
              <Link href="/our-story" className="group inline-flex items-center font-label-caps text-[length:var(--text-label-caps)] font-semibold text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors duration-300 uppercase tracking-widest">
                LEARN MORE ABOUT OUR PROCESS
                <span className="material-symbols-outlined ml-2 transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
