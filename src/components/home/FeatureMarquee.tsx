import React from 'react';

const MARQUEE_TEXTS = [
    "WOOD-PRESSED", "NO PRESERVATIVES", "FSSAI LICENSED", "100% ORGANIC", "CHEMICAL FREE", "BATCH LAB TESTED", "COLD WOOD-PRESSED"
];

export function FeatureMarquee() {
    return (
        <div className="bg-[#17301A] text-white py-4 overflow-hidden flex relative whitespace-nowrap">
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
            <div className="animate-marquee2 inline-block absolute top-4">
                 {MARQUEE_TEXTS.map((text, i) => (
                    <span key={`dup2-${i}`} className="mx-4 text-xs font-bold tracking-[0.2em] inline-flex items-center justify-center">
                        {text} <span className="ml-8 text-[#8C6D3F]">•</span>
                    </span>
                ))}
                {MARQUEE_TEXTS.map((text, i) => (
                    <span key={`dup3-${i}`} className="mx-4 text-xs font-bold tracking-[0.2em] inline-flex items-center justify-center">
                        {text} <span className="ml-8 text-[#8C6D3F]">•</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
