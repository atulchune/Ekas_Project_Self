"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Leaf, Droplet, ShieldCheck, Check, X, ArrowRight, TestTube, Beaker, Download, Printer, Award } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function ProcessPage() {
    const [showLabModal, setShowLabModal] = useState(false);
    const STEPS = [
        {
            num: "01",
            icon: <Sun className="w-4 h-4 text-white" />,
            title: "Manual Seed Grading & Sun Drying",
            desc: "Only plump, unbroken high-oleic sunflower seeds from certified organic farms are chosen. They are sun-dried to optimal 6-8% moisture for effortless natural oil yield."
        },
        {
            num: "02",
            icon: <Leaf className="w-4 h-4 text-white" />,
            title: "Mara Chekka (Vagai Wood) Slow Churning",
            desc: "Seeds are crushed slowly in massive wooden mortars carved from seasoned Albizia lebbeck wood. Friction is kept minimal; temperature never exceeds 35°C, leaving vitamins intact."
        },
        {
            num: "03",
            icon: <Droplet className="w-4 h-4 text-white" />,
            title: "72-Hour Natural Sun Sedimentation",
            desc: "We never force our oil through micro-mesh filters or chemical gums. The oil sits quietly in stainless steel tanks under mild sunlight while natural seed fibers settle naturally."
        },
        {
            num: "04",
            icon: <TestTube className="w-4 h-4 text-white" />,
            title: "NABL Batch Chromatography Verification",
            desc: "Samples from each wooden press run are sent to Varni Analytical LLP to audit FFA, peroxide levels, heavy metals, and test negative for Argemone and mineral oil adulteration."
        },
        {
            num: "05",
            icon: <Beaker className="w-4 h-4 text-white" />,
            title: "Nitrogen-Flushed Amber Bottling",
            desc: "The pure golden oil is bottled in UV-protective dark glass or food-grade tins with nitrogen flushing to displace oxygen, guaranteeing farm-fresh flavor for 12 months."
        }
    ];

    const COMPARISON = [
        {
            criteria: "Extraction Method",
            ekas: "Slow wood pestle friction (< 35°C)",
            refined: "Hexane solvent extraction at 200°C"
        },
        {
            criteria: "Chemical Additives",
            ekas: "0% (Zero chemical touch)",
            refined: "Caustic soda, Phosphoric acid, Bleaching clay"
        },
        {
            criteria: "Natural Vitamin E",
            ekas: "68.8 mg / 100g (Naturally retained)",
            refined: "Virtually 0 mg (Destroyed by high heat)"
        },
        {
            criteria: "Aroma & Flavor",
            ekas: "Nutty, delicate, natural sunflower bouquet",
            refined: "Flat, chemically neutralized, odorless"
        },
        {
            criteria: "Digestion & Lightness",
            ekas: "Extremely light, non-greasy feeling",
            refined: "Heavy sticky film on stomach"
        },
        {
            criteria: "Independent Lab Report",
            ekas: "Published NABL report on every batch",
            refined: "Undisclosed mass industrial blends"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9F7F2] font-sans pt-32 pb-24">
            <div className="w-full max-w-4xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-4 block">
                        OUR FIVE-STAGE METHOD
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-[#17301A] leading-tight mb-6 max-w-2xl mx-auto">
                        The Craft of Slow Wood Pressing
                    </h1>
                    <p className="text-[13px] md:text-[14px] text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                        Purity isn't an accident. It is the outcome of patient human craftsmanship, sacred botanical respect, and uncompromising scientific verification.
                    </p>
                </div>

                {/* 5-Stage Steps */}
                <div className="space-y-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {STEPS.map((step, idx) => (
                        <div key={idx} className="bg-white border border-gray-200/60 rounded-xl p-5 md:p-6 lg:p-8 shadow-sm flex flex-col md:flex-row items-start gap-4 md:gap-8 transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-4 shrink-0">
                                <span className="text-xl md:text-2xl font-serif font-bold text-[#8C6D3F]">{step.num}</span>
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#17301A] rounded-full flex items-center justify-center shrink-0">
                                    {step.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[15px] md:text-[17px] font-serif font-bold text-[#17301A] mb-2">{step.title}</h3>
                                <p className="text-[12px] md:text-[13px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* NABL Certification */}
                <div className="bg-[#FCFAF6] border border-[#8C6D3F]/20 rounded-2xl p-6 md:p-10 mb-20 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">NABL ACCREDITATION</span>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#17301A] mb-3">Every Batch Laboratory Certified</h2>
                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">We don't expect you to take our word for it. We test free fatty acids, peroxide index, heavy metals, and confirm zero adulterants.</p>
                        </div>
                        <button
                            onClick={() => setShowLabModal(true)}
                            className="shrink-0 bg-[#17301A] text-white text-[10px] font-bold px-6 py-3.5 rounded-full uppercase tracking-widest hover:bg-[#204024] transition-colors shadow-sm"
                        >
                            VIEW FULL LAB CERTIFICATE (COA)
                        </button>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="text-center mb-8">
                        <span className="text-[10px] font-bold text-[#8C6D3F] uppercase tracking-widest mb-3 block">THE CLEAR CHOICE</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#17301A]">EKAS Wood Pressed vs. Standard Refined Oil</h2>
                    </div>

                    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        <th className="py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-1/4">CRITERIA</th>
                                        <th className="py-5 px-6 text-[10px] font-bold text-[#17301A] uppercase tracking-widest border-l border-gray-200 w-2/5">EKAS WOOD PRESSED OIL</th>
                                        <th className="py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l border-gray-200 w-2/5">SUPERMARKET REFINED OIL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                                            <td className="py-4 px-6 text-[12px] font-bold text-gray-600">{row.criteria}</td>
                                            <td className="py-4 px-6 border-l border-gray-100">
                                                <div className="flex items-start gap-2 text-[12px] font-bold text-[#17301A]">
                                                    <Check className="w-4 h-4 text-[#2D5C35] shrink-0 mt-[1px]" />
                                                    <span>{row.ekas}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 border-l border-gray-100">
                                                <div className="flex items-start gap-2 text-[12px] font-medium text-gray-500">
                                                    <X className="w-4 h-4 text-red-400 shrink-0 mt-[1px]" />
                                                    <span>{row.refined}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#17301A] text-white text-[11px] font-bold px-8 py-4 rounded-full uppercase tracking-widest hover:bg-[#204024] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                    >
                        ORDER FRESH HARVEST WOOD PRESSED OIL <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>

            {/* Lab Certificate Modal */}
            {showLabModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowLabModal(false)}></div>
                    <div className="bg-[#F9F8F3] rounded-[20px] shadow-2xl relative z-10 w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">

                        {/* Close Button */}
                        <button onClick={() => setShowLabModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-200 z-20">
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-5 md:p-8 overflow-y-auto">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5 pr-8">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Award className="w-3.5 h-3.5 text-[#C19A5B]" />
                                        <span className="text-[9px] font-bold text-[#C19A5B] uppercase tracking-[0.15em]">NABL ACCREDITED LABORATORY CERTIFICATE</span>
                                    </div>
                                    <h2 className="text-2xl md:text-[28px] font-serif font-bold text-[#17301A] mb-1 leading-tight">Certificate of Analysis</h2>
                                    <p className="text-[11px] text-gray-500 font-medium">Testing Agency: Varni Analytical LLP (ISO/IEC 17025:2017 Certified)</p>
                                </div>
                                <div className="bg-[#1F3D28] text-white rounded-lg px-4 py-2 flex flex-col items-center shadow-sm shrink-0">
                                    <span className="text-[8px] font-bold text-[#D9A528] uppercase tracking-widest mb-0.5">BATCH STATUS</span>
                                    <span className="text-[12px] font-bold tracking-wide">100% PASSED PURITY</span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-5 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                <div className="flex-1 pb-3 md:pb-0 md:pr-4">
                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">BATCH NO.</span>
                                    <span className="text-[11px] font-bold text-[#1F2937]">#EK-2024-098</span>
                                </div>
                                <div className="flex-1 py-3 md:py-0 md:px-4">
                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">PRODUCT</span>
                                    <span className="text-[11px] font-bold text-[#1F2937]">Wood Pressed Sunflower Oil</span>
                                </div>
                                <div className="flex-1 py-3 md:py-0 md:px-4">
                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">TESTING DATE</span>
                                    <span className="text-[11px] font-bold text-[#1F2937]">Aug 12, 2024</span>
                                </div>
                                <div className="flex-1 pt-3 md:pt-0 md:pl-4">
                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">SAMPLE ORIGIN</span>
                                    <span className="text-[11px] font-bold text-[#1F2937]">Deccan Batch #A4</span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto mb-5 border-t border-b border-gray-200 py-1">
                                <table className="w-full text-left border-collapse min-w-[580px]">
                                    <thead>
                                        <tr>
                                            <th className="py-2.5 px-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">PARAMETER</th>
                                            <th className="py-2.5 px-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">FSSAI STANDARD</th>
                                            <th className="py-2.5 px-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">EKAS TESTED VALUE</th>
                                            <th className="py-2.5 px-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest text-right">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[11px]">
                                        {[
                                            { p: "Free Fatty Acids (as Oleic %)", m: "IS: 548 (Part 1) Cl. 7", s: "Max 1.50%", v: "0.28%", st: "PASSED" },
                                            { p: "Peroxide Value (meq O2/kg)", m: "AOCS Cd 8b-90", s: "Max 10.0 meq/kg", v: "1.42 meq/kg", st: "PASSED" },
                                            { p: "Natural Vitamin E (Tocopherol)", m: "HPLC AOAC 971.30", s: "Natural Occurrence", v: "48.6 mg / 100g", st: "EXCEEDED", highlight: true },
                                            { p: "Argemone Mexicana Test", m: "TLC Method", s: "Negative", v: "Absent / Negative", st: "PASSED" },
                                            { p: "Mineral Oil Adulteration", m: "Holde's Test", s: "Negative", v: "Absent / Negative", st: "PASSED" },
                                            { p: "Heavy Metals (Lead, Cadmium, Arsenic)", m: "ICP-MS", s: "< 0.1 ppm", v: "< 0.01 ppm (Not Detected)", st: "PASSED" },
                                            { p: "Moisture and Insoluble Impurities", m: "IS: 548 (Part 1) Cl. 5", s: "Max 0.10%", v: "0.04%", st: "PASSED" }
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-t border-gray-200/60 hover:bg-black/[0.03] transition-colors">
                                                <td className="py-3 px-2">
                                                    <span className="font-bold text-[#1F2937] block text-[11px] leading-tight">{row.p}</span>
                                                    <span className="text-[9px] text-gray-400">{row.m}</span>
                                                </td>
                                                <td className="py-3 px-2 text-gray-500 font-medium">{row.s}</td>
                                                <td className={cn("py-3 px-2 font-bold", row.highlight ? "text-[#17301A]" : "text-[#1F2937]")}>{row.v}</td>
                                                <td className="py-3 px-2 text-right">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest",
                                                        row.st === "EXCEEDED" ? "bg-[#EAF5E5] text-[#2D5C35]" : "bg-[#F3F4F6] text-[#4B5563]"
                                                    )}>
                                                        <Check className="w-2.5 h-2.5" /> {row.st}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#FCFAF6] border border-[#C19A5B] flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-4 h-4 text-[#C19A5B]" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-[#1F2937] uppercase tracking-widest block mb-0.5">AUDITED & APPROVED BY SENIOR CHEMIST</span>
                                        <span className="text-[10px] text-gray-500 font-medium">Dr. S. K. Kulkarni, Ph.D. (Lipid Chromatography Specialist)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button className="flex items-center gap-1.5 px-4 py-2 text-[9px] font-bold text-[#1F2937] uppercase tracking-widest border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                                        <Printer className="w-3.5 h-3.5" /> PRINT
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 text-[9px] font-bold text-white uppercase tracking-widest bg-[#1F3D28] rounded-full hover:bg-[#17301A] transition-colors shadow-sm">
                                        <Download className="w-3.5 h-3.5" /> DOWNLOAD PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
