"use client";

import Image from "next/image";
import { Quote, Heart, Leaf, Users, ShieldCheck, Sun, Target, Sprout, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OurStoryPage() {
    return (
        <div className="min-h-screen bg-[#F9F7F2] font-sans pt-20">
            {/* HERO SECTION */}
            <div className="relative bg-[#2D5C35] text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                    </svg>
                </div>
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight animate-fade-in-up">
                        Rooted in Tradition,<br className="hidden md:block" /> Driven by Purpose
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed font-light mb-8 animate-fade-in-up delay-100">
                        From a passion project to a movement. Discover the journey of pure, chemical-free living that empowers communities.
                    </p>
                    <div className="inline-flex items-center gap-2 border border-[#D9A528] text-[#D9A528] px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider animate-bounce-subtle">
                        <Sprout className="w-5 h-5" /> Pure ~ Organic ~ Empowering
                    </div>
                </div>
            </div>

            {/* FOUNDERS & ORIGIN STORY */}
            <section className="py-20 container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 md:order-1">
                        <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative group">
                            {/* Placeholder for Founders Image - In a real app, this would be the actual image */}
                            <div className="absolute inset-0 bg-[#2D5C35]/20 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-serif italic text-2xl bg-gray-100">
                                Founders<br />Sanjit & Charan
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#D9A528] rounded-full opacity-20 blur-3xl" />
                        <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#2D5C35] rounded-full opacity-20 blur-3xl" />
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <h2 className="text-xs font-bold text-[#D9A528] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-8 h-px bg-[#D9A528]"></span> Our Origins
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1F2937]">
                            A Journey from Passion<br />to Purpose
                        </h3>
                        <div className="text-gray-600 space-y-4 leading-relaxed text-lg">
                            <p>
                                What began in 2021 as a passion project with <strong>Ethical Marketing Consulting</strong> evolved into a mission-driven food brand by November 2024.
                            </p>
                            <p>
                                Founded by engineers-turned-entrepreneurs <strong>Sanjit Kaur</strong> and <strong>Charan Kanwal Singh</strong>, EKAS Healthy Foods was born from a desire to bring pure, traditional, and chemical-free products back to our tables—products that not only nourish the body but also empower rural communities.
                            </p>
                        </div>
                        <div className="pt-4 flex flex-col md:flex-row gap-6">
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2D5C35] font-bold text-xl">21</span>
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase">Started in</span>
                                    <span className="font-serif font-bold text-[#1F2937]">2021</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center text-[#D9A528] font-bold text-xl">24</span>
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase">Rebranded in</span>
                                    <span className="font-serif font-bold text-[#1F2937]">Nov 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISION & MISSION CARDS */}
            <section className="py-16 bg-white relative">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vision Card */}
                        <div className="bg-[#F9F7F2] p-10 rounded-3xl border border-[#2D5C35]/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#2D5C35] group-hover:text-white transition-colors text-[#2D5C35]">
                                <Sun className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#1F2937] mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To create a healthier world with pure, chemical-free oils while fostering a strong community of empowered women entrepreneurs. Ekas Foods strives to blend tradition with sustainability for a better future.
                            </p>
                        </div>

                        {/* Mission Card */}
                        <div className="bg-[#2D5C35] p-10 rounded-3xl text-white shadow-2xl shadow-green-900/20 hover:scale-[1.02] transition-all duration-300">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 text-[#D9A528]">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4">Our Mission</h3>
                            <p className="text-green-50 leading-relaxed text-lg opacity-90">
                                At Ekas Foods, we empower women by providing sustainable employment opportunities while delivering 100% organic, wood-pressed cooking oils. We are committed to purity, health, and ethical practices in every drop.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="py-24 container mx-auto px-4 md:px-6 text-center">
                <div className="mb-16">
                    <h2 className="text-sm font-bold text-[#D9A528] uppercase tracking-widest mb-3">What We Stand For</h2>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-[#1F2937]">Our Core Values</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Leaf, title: "Tradition", desc: "Honoring ancient wood-pressed methods to retain natural goodness." },
                        { icon: ShieldCheck, title: "Transparency", desc: "Honest sourcing, clear labels, and absolutely no hidden chemicals." },
                        { icon: Heart, title: "Trust", desc: "Building relationships through purity and unwavering quality commitment." }
                    ].map((value, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-white p-8 rounded-3xl border border-dashed border-gray-200 hover:border-[#2D5C35] transition-colors group">
                            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2D5C35] mb-6 group-hover:scale-110 transition-transform">
                                <value.icon className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-bold text-[#1F2937] mb-3">{value.title}</h4>
                            <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="py-24 bg-[#1F2937] text-white relative overflow-hidden">
                {/* Decorative bg elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5C35] rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2"></div>

                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-[#D9A528] text-[#1F2937] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">#TeamEkas</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Women Lead - Passion Driven!</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            The powerhouse force behind our mission. Empowering communities one step at a time.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            "Sanjit Kaur", "Jasleen Kaur", "Shilpa Jain",
                            "Mukhdeep Kaur", "Pranjal Ranadive", "Siddhi Kamble",
                            "Monika Karkade", "Brijal Patel", "Kusum Shukla"
                        ].map((name, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group text-center">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#2D5C35] to-[#1F2937] border-2 border-[#D9A528] mb-4 flex items-center justify-center text-xl font-serif italic text-[#D9A528] shadow-lg group-hover:scale-110 transition-transform">
                                    {name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <h4 className="font-bold text-lg text-white mb-1 group-hover:text-[#D9A528] transition-colors">{name}</h4>
                                <div className="h-0.5 w-8 bg-[#2D5C35] mx-auto mt-3 group-hover:w-16 group-hover:bg-[#D9A528] transition-all"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRE-FOOTER CTA */}
            <section className="py-20 container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto bg-[#D9A528]/10 rounded-3xl p-10 md:p-16 border border-[#D9A528]/20">
                    <Quote className="w-12 h-12 text-[#D9A528] mx-auto mb-6 opacity-50" />
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#1F2937] mb-6">
                        "With every bottle, we aim to deliver health and wellness while positively impacting the planet."
                    </h2>
                    <a href="/shop" className="inline-flex items-center gap-2 bg-[#2D5C35] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1F2937] transition-all shadow-lg hover:shadow-green-900/30">
                        Explore Our Collection <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>
        </div>
    );
}
