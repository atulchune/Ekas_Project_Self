import { Hero } from "@/components/home/Hero";
import { FeatureMarquee } from "@/components/home/FeatureMarquee";
import { OilCollections } from "@/components/home/OilCollections";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WomenStory } from "@/components/home/WomenStory";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Certifications } from "@/components/home/Certifications";
import { getBestsellers, getCategories, getFeaturedProducts, getNewLaunches } from "@/lib/api/catalog";
import { mapListItemToCard } from "@/lib/mappers/product";

export default async function Home() {
  const [featured, bestsellers, newLaunches, categories] = await Promise.all([
    getFeaturedProducts(),
    getBestsellers(),
    getNewLaunches(),
    getCategories(),
  ]);

  // Seed data doesn't flag any product as "featured" yet — bestsellers is the
  // best available proxy so the homepage isn't empty.
  const heroSource = new Map([...featured, ...bestsellers, ...newLaunches].map((p) => [p.id, p]));
  const heroProducts = Array.from(heroSource.values()).slice(0, 8).map(mapListItemToCard);
  const featuredProducts = (featured.length ? featured : bestsellers).map(mapListItemToCard);

  return (
    <>
      <Hero products={heroProducts} />
      <FeatureMarquee />
      <OilCollections />
      <FeaturedProducts products={featuredProducts} />
      <Categories categories={categories} />
      <WomenStory />
      <Testimonials />
      <WhyChooseUs />
      <Certifications />
    </>
  );
}
