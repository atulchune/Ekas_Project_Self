"use client";

import { MapPin, Phone, Mail, Send, Clock, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formState);
        alert("Thank you for reaching out! We will get back to you soon.");
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] pt-24 pb-12">
            {/* Header Section */}
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 mb-10 text-center max-w-3xl">
                <span className="text-[#D9A528] font-bold tracking-[0.2em] uppercase text-xs mb-3 block animate-fade-in">Contact Us</span>
                <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#1F2937] mb-4">Get in Touch</h1>
                <p className="text-gray-600 text-base leading-relaxed">
                    We’d love to hear from you! Whether you have questions about our products or need assistance, we’re here to help.
                </p>
            </div>

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20 animate-slide-up">
                    {/* Contact Information - 5/12 */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 h-full relative overflow-hidden group transition-all duration-300">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#2D5C35]/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

                            <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-10 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-[#D9A528] rounded-full" /> Contact Details
                            </h3>

                            <div className="space-y-10 relative z-10">
                                <div className="flex gap-5 group/item">
                                    <div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#2D5C35] group-hover/item:bg-[#2D5C35] group-hover/item:text-white transition-colors duration-300 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-lg mb-1.5">Corporate Office</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed font-light">
                                            Ekas Marketing Solutions Pvt Ltd,<br />
                                            Plot No. 39, Diamond Industrial Estate,<br />
                                            Daman 396210, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 group/item">
                                    <div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#2D5C35] group-hover/item:bg-[#2D5C35] group-hover/item:text-white transition-colors duration-300 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-lg mb-1.5">Customer Support</h4>
                                        <p className="text-gray-500 font-medium">+91 9081238888</p>
                                        <p className="text-[#D9A528] text-[11px] font-semibold mt-1 uppercase tracking-wide">Mon - Sat, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 group/item">
                                    <div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#2D5C35] group-hover/item:bg-[#2D5C35] group-hover/item:text-white transition-colors duration-300 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-lg mb-1.5">Email Us</h4>
                                        <a href="mailto:wecare@ekashealthyfoods.com" className="text-gray-500 hover:text-[#2D5C35] transition-colors font-medium break-all">
                                            wecare@ekashealthyfoods.com
                                        </a>
                                        <p className="text-[11px] text-gray-400 mt-1 font-light">For bulk orders & queries</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Contact Form - Refined & Compact */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 relative overflow-hidden">
                            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-1">Send us a Message</h2>
                            <p className="text-gray-500 mb-5 text-sm font-light">We usually respond within a few hours.</p>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label htmlFor="name" className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 rounded-xl bg-[#F9F7F2]/50 border border-gray-200 focus:border-[#2D5C35] focus:bg-white focus:outline-none transition-all text-sm text-gray-700 placeholder:text-gray-400/70"
                                            placeholder="John Doe"
                                            value={formState.name}
                                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="phone" className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="w-full px-4 py-3 rounded-xl bg-[#F9F7F2]/50 border border-gray-200 focus:border-[#2D5C35] focus:bg-white focus:outline-none transition-all text-sm text-gray-700 placeholder:text-gray-400/70"
                                            placeholder="+91 99999 99999"
                                            value={formState.phone}
                                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 rounded-xl bg-[#F9F7F2]/50 border border-gray-200 focus:border-[#2D5C35] focus:bg-white focus:outline-none transition-all text-sm text-gray-700 placeholder:text-gray-400/70"
                                        placeholder="john@example.com"
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="message" className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                                    <textarea
                                        id="message"
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-[#F9F7F2]/50 border border-gray-200 focus:border-[#2D5C35] focus:bg-white focus:outline-none transition-all text-sm text-gray-700 placeholder:text-gray-400/70 resize-none"
                                        placeholder="Tell us how we can help..."
                                        value={formState.message}
                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#2D5C35] text-white font-bold py-3.5 rounded-full text-sm shadow-lg shadow-green-900/20 hover:bg-[#234a2a] hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
                                >
                                    Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section - Accordion Style */}
                <div className="max-w-3xl mx-auto mb-10">
                    <div className="text-center mb-12">
                        <span className="text-[#D9A528] font-bold uppercase tracking-widest text-[10px] mb-3 block">Common Questions</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                question: "Do you ship internationally?",
                                answer: "Currently, we ship across India using reliable courier partners. International shipping is available on special request for bulk orders."
                            },
                            {
                                question: "Are your oils truly cold-pressed?",
                                answer: "Yes! We use traditional wood-pressing (Ghani) methods at low RPM to ensure the oil temperature never exceeds 45°C, retaining all nutrients."
                            },
                            {
                                question: "Do you offer bulk sizing for businesses?",
                                answer: "Absolutely. We supply 5L, 15L, and custom bulk packaging for enterprise clients, hotels, and organic stores. Contact us for a quote."
                            },
                            {
                                question: "Is the packaging plastic-free?",
                                answer: "Yes, our retail oils come in premium glass bottles. We are committed to sustainability and reducing our plastic footprint."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-all">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#F9F7F2]/50 transition-colors"
                                >
                                    <span className={cn("font-medium text-[15px]", openFaqIndex === i ? "text-[#2D5C35]" : "text-gray-800")}>
                                        {faq.question}
                                    </span>
                                    {openFaqIndex === i ? (
                                        <ChevronUp className="w-4 h-4 text-[#2D5C35]" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                <div className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out px-5",
                                    openFaqIndex === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                                )}>
                                    <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-3 font-light">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
