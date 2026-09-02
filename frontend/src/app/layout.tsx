import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartSheet } from "@/components/cart/CartSheet";
import { FavoritesSheet } from "@/components/favorites/FavoritesSheet";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "EKAS - Ancestral Luxury",
  description: "Ancestral Indian wisdom, bottled for the modern kitchen. Pure, wood-pressed, and ethically sourced.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </head>
      <body
        className={`${inter.className} ${playfair.variable} bg-background text-on-background font-body-md antialiased selection:bg-secondary/20 selection:text-primary`}
      >
        <FavoritesProvider>
          <CartProvider>
            <Navbar />
            <CartSheet />
            <FavoritesSheet />
            <WhatsAppButton />
            <main className="pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
