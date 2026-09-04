"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Shipping and Delivery Time",
      answer: "We deliver across India within 3-5 business days. International shipping times vary by destination."
    },
    {
      question: "Return and Refund Policy",
      answer: "We offer a 7-day hassle-free return policy for unopened products if you are not completely satisfied with your purchase."
    },
    {
      question: "Why does wood-pressed oil cost more than refined oil?",
      answer: "Unlike refined oils that use high heat and chemicals to maximize yield, our wood-pressed (Ghani) method is a slow, cold process that preserves all natural nutrients, aroma, and flavor. It requires more raw ingredients to produce the same amount of oil, ensuring uncompromising purity."
    },
    {
      question: "Shelf Life and Storage",
      answer: "EKAS oils have a shelf life of 6-9 months. Store in a cool, dark place away from direct sunlight to maintain optimal freshness."
    },
    {
      question: "Is it safe for daily cooking?",
      answer: "Absolutely. Our wood-pressed oils have high smoke points and are perfect for all types of Indian cooking, from deep frying to tempering (tadka)."
    }
  ];

  return (
    <section className="bg-surface pt-8 pb-8 md:pt-12 md:pb-12" id="faq">
      <div className="max-w-4xl mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <h2 className="font-headline-md text-[length:var(--text-headline-md)] text-primary text-center mb-12 md:mb-16">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-secondary/30 pb-4">
              <button
                className="w-full flex justify-between items-center text-left group py-4"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-headline-md text-2xl text-primary">{faq.question}</span>
                <span className={cn(
                  "material-symbols-outlined text-secondary transition-transform duration-300",
                  openIndex === index ? "rotate-45" : "group-hover:scale-110"
                )}>
                  add
                </span>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"
                )}
              >
                <p className="font-body-md text-[length:var(--text-body-md)] text-on-surface-variant">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
