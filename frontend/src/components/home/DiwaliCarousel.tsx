"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getAssetUrl } from "@/lib/getAsset";

export function DiwaliCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    {
      image: "/images/diwali_offer_20.jpg",
      offer: "FESTIVE OFFER — 20% OFF",
      title: "A Brighter Festive Season, Naturally",
      desc: "Illuminate your home with the purity of ancestral traditions. Our wood-pressed oils bring health and radiance to every festive meal."
    },
    {
      image: "/images/diwali_bogo.jpg",
      offer: "DIWALI SPECIAL — BUY 1 GET 1 FREE",
      title: "Double the Purity, Double the Joy",
      desc: "Stock up on wellness this Diwali. Buy any wood-pressed oil and get a second one absolutely free for a limited time."
    },
    {
      image: "/images/diwali_free_shipping.jpg",
      offer: "FESTIVE PERK — FREE SHIPPING",
      title: "Delivered Fresh From Our Mill",
      desc: "Enjoy complimentary shipping on all orders over ₹999. Let the essence of tradition reach your doorstep this festive season."
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 overflow-hidden relative group reveal-section" id="diwali-carousel">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="relative h-[600px] md:h-[500px] overflow-hidden rounded-lg">
          
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="w-full md:w-1/2 bg-surface-container-low p-10 md:p-20 flex flex-col justify-center">
                <span className="font-label-caps text-[length:var(--text-label-caps)] text-[#B88A2A] font-semibold mb-4 tracking-widest uppercase">
                  {slide.offer}
                </span>
                <h2 className="font-headline-lg text-[length:var(--text-headline-lg-mobile)] md:text-[length:var(--text-headline-lg)] text-primary-container mb-6 leading-tight">
                  {slide.title}
                </h2>
                <p className="font-body-md text-[length:var(--text-body-md)] text-on-surface-variant max-w-md mb-8">
                  {slide.desc}
                </p>
                <Link href="/shop" className="inline-block w-fit font-label-caps text-[length:var(--text-label-caps)] font-semibold tracking-widest uppercase text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors">
                  SHOP THE COLLECTION
                </Link>
              </div>
              <div 
                className="w-full md:w-1/2 bg-cover bg-center bg-no-repeat" 
                style={{ backgroundImage: `url('${slide.image}')` }}
              ></div>
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-secondary opacity-100 w-4' : 'bg-secondary opacity-30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
