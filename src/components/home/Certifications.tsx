"use client";

import { ShieldCheck, Award, FileCheck, CheckCircle, Shield, Stamp } from "lucide-react";

const certificates = [
    {
        name: "ISO 9001",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M60 10 a 50 50 0 0 1 0 100 a 50 50 0 0 1 0 -100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M10 60 h 100 M60 10 v 100" stroke="currentColor" strokeWidth="2" />
                <ellipse cx="60" cy="60" rx="22" ry="50" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="60" y="70" textAnchor="middle" fontSize="32" fontWeight="900" fontFamily="sans-serif" fill="currentColor">ISO</text>
            </svg>
        )
    },
    {
        name: "FSSAI",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4" />
                <text x="60" y="65" textAnchor="middle" fontSize="30" fontWeight="bold" fontStyle="italic" fontFamily="serif" fill="currentColor">fssai</text>
                <path d="M30 75 h 60" stroke="currentColor" strokeWidth="3" />
                <path d="M80 40 Q 85 30 95 35 Q 85 45 80 40" fill="currentColor" />
            </svg>
        )
    },
    {
        name: "FDA",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <rect x="10" y="25" width="100" height="70" fill="none" stroke="currentColor" strokeWidth="4" rx="4" />
                <text x="60" y="72" textAnchor="middle" fontSize="40" fontWeight="900" fontFamily="sans-serif" fill="currentColor" letterSpacing="-1">FDA</text>
                <path d="M30 85 h 60" stroke="currentColor" strokeWidth="2" />
            </svg>
        )
    },
    {
        name: "GMP",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="6" />
                <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                <text x="60" y="70" textAnchor="middle" fontSize="30" fontWeight="900" fontFamily="sans-serif" fill="currentColor">GMP</text>
            </svg>
        )
    },
    {
        name: "HACCP",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M35 60 l 15 15 l 35 -35" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <text x="60" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">HACCP</text>
                <text x="60" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">CERTIFIED</text>
            </svg>
        )
    },
    {
        name: "100% Organic",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <path d="M60 10 C 20 10 10 50 10 60 C 10 90 40 110 60 110 C 80 110 110 90 110 60 C 110 50 100 10 60 10 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="sans-serif" fill="currentColor">100%</text>
                <text x="60" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">ORGANIC</text>
            </svg>
        )
    },
    {
        name: "Non-GMO",
        icon: (
            <svg viewBox="0 0 120 120" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#2E4F32]">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M40 40 C 60 10 80 40 80 40" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M40 80 C 60 110 80 80 80 80" fill="none" stroke="currentColor" strokeWidth="3" />
                <text x="60" y="66" textAnchor="middle" fontSize="24" fontWeight="900" fontFamily="sans-serif" fill="currentColor">NON-GMO</text>
            </svg>
        )
    }
];

export function Certifications() {
    return (
        <section className="bg-white py-6 md:py-8 border-t border-gray-100 overflow-hidden">
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-14">
                    {certificates.map((cert, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center opacity-90">
                            {cert.icon}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
