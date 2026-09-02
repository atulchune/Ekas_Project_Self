"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
    { name: "Journal", href: "/journal" },
  ];

  return (
    <>
      <nav
        className={cn(
          "bg-background/90 backdrop-blur-md text-primary font-label-caps text-[length:var(--text-label-caps)] fixed top-0 w-full z-50 border-b transition-all duration-700 ease-in-out",
          isScrolled ? "border-secondary/50 shadow-sm" : "border-transparent"
        )}
        id="main-nav"
      >
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] flex justify-between items-center h-20">
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button 
              className="hover:opacity-70 transition-opacity p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>

          {/* Navigation Links (Left) */}
          <div className="hidden md:flex space-x-8 items-center flex-1 uppercase tracking-widest font-semibold">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "transition-colors duration-300 hover:opacity-70 py-1",
                    isActive
                      ? "text-primary border-b-2 border-secondary pb-1"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Brand Logo (Center) */}
          <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none">
            <Link href="/" className="flex items-center group">
              <div className="relative w-[180px] h-[45px] transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/images/logo.png"
                  alt="EKAS Logo"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-center transition-all duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Trailing Icons (Right) */}
          <div className="flex items-center space-x-4 md:space-x-6 flex-1 justify-end">
            <button 
              className="hover:opacity-70 transition-opacity"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            
            <button 
              className="hidden md:block hover:opacity-70 transition-opacity"
              onClick={() => setIsAuthOpen(true)}
            >
              <span className="material-symbols-outlined">person</span>
            </button>
            
            <button 
              className="hidden md:block hover:opacity-70 transition-opacity relative group"
              onClick={openFavorites}
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">favorite</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold bg-secondary text-primary-foreground shadow-sm">
                  {favorites.length}
                </span>
              )}
            </button>
            
            <button 
              className="hover:opacity-70 transition-opacity relative group"
              onClick={openCart}
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold bg-secondary text-primary-foreground shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-secondary/20 absolute top-full left-0 w-full px-[var(--spacing-margin-mobile)] py-6 shadow-lg flex flex-col space-y-4 animate-fade-in uppercase tracking-widest font-semibold text-[length:var(--text-label-caps)]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-on-surface hover:text-primary border-b border-secondary/10 pb-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col space-y-4">
              <button
                onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
                className="flex items-center space-x-2 text-on-surface hover:text-primary pb-2"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                <span>Login / Sign Up</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
