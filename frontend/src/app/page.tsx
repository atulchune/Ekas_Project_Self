import { Hero } from "@/components/home/Hero";
import { FeatureMarquee } from "@/components/home/FeatureMarquee";
import { OilCollections } from "@/components/home/OilCollections";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WomenStory } from "@/components/home/WomenStory";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Certifications } from "@/components/home/Certifications";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureMarquee />
      <OilCollections />
      <FeaturedProducts />
      <WomenStory />
      <Testimonials />
      <WhyChooseUs />
      <Certifications />
    </>
  );
}
