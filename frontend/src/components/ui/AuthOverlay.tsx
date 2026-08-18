"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthView = "login" | "signup";

import { createPortal } from "react-dom";

export function AuthOverlay({ isOpen, onClose }: AuthOverlayProps) {
    const [view, setView] = useState<AuthView>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const resetForm = () => {
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setShowPassword(false);
        setIsLoading(false);
    };

    // Reset on Close
    useEffect(() => {
        if (!isOpen) {
            // fast reset or delayed reset?
            // delayed slightly to avoid jitter during close anim
            const t = setTimeout(resetForm, 300);
            return () => clearTimeout(t);
        } else {
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = "unset"; };
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        onClose();
        alert(view === "login" ? "Welcome back!" : "Account created successfully!");
    };

    const toggleView = () => {
        setView(view === "login" ? "signup" : "login");
        resetForm();
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative w-full max-w-md bg-[#FDFAF5] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col my-8 z-[10000]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Image/Gradient */}
                            <div className="relative h-32 bg-[#2D5C35] overflow-hidden flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 bg-[url('/images/pattern-leaf.png')] opacity-10" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A528] rounded-full blur-[50px] translate-x-1/2 -translate-y-1/2 opacity-30" />

                                <h2 className="relative z-10 font-serif text-3xl font-bold text-white tracking-wide">
                                    {view === "login" ? "Welcome Back" : "Join Our Family"}
                                </h2>

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10 flex-1 custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={view}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4"
                                        >
                                            {view === "signup" && (
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            required={view === "signup"}
                                                            placeholder="John Doe"
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-[#2D5C35] focus:ring-1 focus:ring-[#2D5C35] outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="you@example.com"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-[#2D5C35] focus:ring-1 focus:ring-[#2D5C35] outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        required
                                                        placeholder="••••••••"
                                                        value={formData.password}
                                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                        className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-[#2D5C35] focus:ring-1 focus:ring-[#2D5C35] outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {view === "login" && (
                                                <div className="flex items-center justify-between text-xs">
                                                    <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700">
                                                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#2D5C35] focus:ring-[#2D5C35]" />
                                                        Remember me
                                                    </label>
                                                    <a href="#" className="font-bold text-[#D9A528] hover:text-[#b88b22]">Forgot Password?</a>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#2D5C35] text-white font-bold py-4 rounded-full shadow-xl shadow-green-900/20 hover:bg-[#234a2a] hover:shadow-2xl active:scale-[0.98] transition-all duration-200 mt-4 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {view === "login" ? "Sign In" : "Create Account"}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Footer Toggle */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-500 text-sm">
                                        {view === "login" ? "New to Healthy Foods? " : "Already have an account? "}
                                        <button
                                            onClick={toggleView}
                                            className="font-bold text-[#2D5C35] hover:underline hover:text-[#234a2a] transition-colors"
                                        >
                                            {view === "login" ? "Create an account" : "Log in"}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
