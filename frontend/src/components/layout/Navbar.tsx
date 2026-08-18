"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { AuthOverlay } from "@/components/ui/AuthOverlay";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const pathname = usePathname();
    const { openCart, cartCount } = useCart();
    const { openFavorites, favorites } = useFavorites();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Our Story", href: "/our-story" },
        { name: "Blogs", href: "/blogs" },
        { name: "Contact", href: "/contact" },
    ];

    // Determine if we should show a transparent/white text version of the navbar
    const isTransparentOnHome = !isScrolled && pathname === "/";

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
                isScrolled
                    ? "bg-[#FDFAF5]/95 backdrop-blur-md shadow-sm py-3"
                    : pathname === "/" 
                        ? "bg-transparent py-5" 
                        : "bg-[#FDFAF5]/95 shadow-sm py-3"
            )}
        >
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <div className="relative w-[180px] h-[45px] transition-transform duration-300 group-hover:scale-[1.02]">
                        <Image
                            src="/images/logo.png"
                            alt="Healthy Foods Logo"
                            fill
                            priority
                            unoptimized
                            className={cn(
                                "object-contain object-left transition-all duration-300",
                                (isScrolled || pathname !== "/") && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                            )}
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => {
                        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "transition-colors font-medium text-sm uppercase tracking-wide relative py-1 group",
                                    isActive 
                                        ? ((!isScrolled && pathname === "/") ? "text-white font-bold" : "text-primary font-bold")
                                        : ((!isScrolled && pathname === "/") ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary")
                                )}
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-300 transform origin-left",
                                    (!isScrolled && pathname === "/") ? "bg-white" : "bg-secondary",
                                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )} />
                            </Link>
                        );
                    })}
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-5">
                    <button
                        className={cn(
                            "transition-colors",
                            (!isScrolled && pathname === "/") ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary"
                        )}
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className={cn(
                            "transition-colors hidden sm:block",
                            (!isScrolled && pathname === "/") ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary"
                        )}
                    >
                        <User className="w-5 h-5" />
                    </button>
                    <button
                        onClick={openFavorites}
                        className={cn(
                            "transition-colors relative group",
                            (!isScrolled && pathname === "/") ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary"
                        )}
                    >
                        <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {favorites.length > 0 && (
                            <span className={cn(
                                "absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm",
                                (!isScrolled && pathname === "/") ? "bg-white text-black" : "bg-secondary text-primary-foreground"
                            )}>
                                {favorites.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={openCart}
                        className={cn(
                            "transition-colors relative group",
                            (!isScrolled && pathname === "/") ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary"
                        )}
                    >
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className={cn(
                            "absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm",
                            (!isScrolled && pathname === "/") ? "bg-white text-black" : "bg-secondary text-primary-foreground"
                        )}>
                            {cartCount}
                        </span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={cn(
                            "md:hidden transition-colors",
                            (!isScrolled && pathname === "/") ? "text-white" : "text-foreground hover:text-primary"
                        )}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t absolute top-full left-0 w-full px-4 py-6 shadow-lg flex flex-col space-y-4 animate-fade-in">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-foreground hover:text-primary font-medium text-lg border-b border-gray-100 pb-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 flex flex-col space-y-3">
                        <button
                            onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
                            className="flex items-center space-x-2 text-foreground/80 font-medium"
                        >
                            <User className="w-5 h-5" /> <span>Login / Sign Up</span>
                        </button>
                    </div>
                </div>
            )}

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </nav>
    );
}
