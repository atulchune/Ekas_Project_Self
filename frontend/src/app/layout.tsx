import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartSheet } from "@/components/cart/CartSheet";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EKAS Healthy Foods | Pure Cold Pressed Oils & Organic Ghee",
  description: "Discover the authentic taste of health with EKAS Healthy Foods. Premium cold-pressed oils, A2 Ghee, and organic seeds sourced directly from farms.",
  keywords: "cold pressed oil, A2 ghee, organic food, healthy oils, ekas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${manrope.className} ${manrope.variable} antialiased bg-background text-foreground overflow-x-hidden font-sans`}
      >
        <FavoritesProvider>
          <CartProvider>
            <Navbar />
            <CartSheet />
            <FavoritesSheet />
            <WhatsAppButton />
            <main className="min-h-screen pt-0">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
