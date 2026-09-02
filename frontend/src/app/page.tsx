import { Hero } from "@/components/home/Hero";
import { DiwaliCarousel } from "@/components/home/DiwaliCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { QuickShop } from "@/components/home/QuickShop";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Heritage } from "@/components/home/Heritage";
import { FAQ } from "@/components/home/FAQ";
import { LabTested } from "@/components/home/LabTested";

export default function Home() {
  return (
    <>
      <Hero />
      <DiwaliCarousel />
      <TrustStrip />
      <BrandPhilosophy />
      <QuickShop />
      <FinalCTA />
      <Heritage />
      <FAQ />
      <LabTested />
    </>
  );
}
