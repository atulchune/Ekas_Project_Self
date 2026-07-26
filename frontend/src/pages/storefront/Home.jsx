import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHomepageContent } from '@/hooks/useContent'
import { useCategories, useBestsellers, useProduct } from '@/hooks/useCatalog'
import { useRecipes } from '@/hooks/useContent'
import { useBundles } from '@/hooks/useCatalog'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Button } from '@/components/ui/Button'
import { Card, Skeleton } from '@/components/ui/primitives'
import { Section, SectionHeader, ProductGrid } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

function findSection(sections, type) {
  return sections?.find((s) => s.section_type === type)
}

function HeroImageScroller({ products }) {
  if (!products?.length) return null
  // Duplicate the list so the marquee can loop seamlessly.
  const track = [...products, ...products]
  return (
    <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex h-full w-max gap-2"
        animate={{ x: ['-50%', '0%'] }}
        transition={{ duration: products.length * 6, repeat: Infinity, ease: 'linear' }}
      >
        {track.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            to={`/products/${p.slug}`}
            className="group relative block h-full w-[70vw] shrink-0 overflow-hidden sm:w-[45vw] md:w-[32vw] lg:w-[24vw]"
          >
            {p.primary_image ? (
              <img
                src={p.primary_image}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-leaf-100 text-leaf-600">
                <span className="font-serif text-4xl">{p.name?.[0]}</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-base font-medium text-ivory">{p.name}</p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}

function HeroSection({ section }) {
  const { data } = useBestsellers()
  const products = data?.results ?? []

  return (
    <section className="relative isolate h-[540px] overflow-hidden bg-forest-800 text-ivory md:h-[640px]">
      {products.length > 0 ? (
        <HeroImageScroller products={products} />
      ) : (
        section?.image && (
          <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/55 to-forest-900/85" />

      <Section as="div" size="wide" spacing="none" className="relative z-10 flex h-full items-center" containerClassName="flex h-full items-center">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-ghee-300">Pure. Traditional. Empowering.</p>
          <h1 className="mt-3 text-4xl leading-tight text-ivory md:text-5xl">
            {section?.title || 'Traditionally made. Honestly sourced.'}
          </h1>
          <p className="mt-4 max-w-md text-ivory/80">
            {section?.body ||
              'A2 Bilona ghee, wood-pressed oils, and raw honey — prepared the traditional way by rural women artisans.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/products" size="lg">
              Shop Pure Foods
            </Button>
            <Button as={Link} to="/our-process" size="lg" variant="outline" className="border-ivory text-ivory hover:bg-ivory/10">
              Discover Our Process
            </Button>
          </div>
        </motion.div>
      </Section>
    </section>
  )
}

function TrustStrip({ section }) {
  const items = section?.content?.items || [
    'Traditionally prepared, small-batch production',
    'Sourced directly from farmers and rural women artisans',
    'No hidden additives -- ingredients are always listed',
  ]
  return (
    <Section as="div" spacing="none" className="border-y border-forest-100 bg-forest-50/60" containerClassName="grid gap-4 py-6 text-center text-sm text-forest-800 md:grid-cols-3">
      {items.map((item, i) => (
        <p key={i} className="font-medium">
          {item}
        </p>
      ))}
    </Section>
  )
}

function CategoryGrid() {
  const { data: categories, isLoading } = useCategories()
  return (
    <Section spacing="lg">
      <SectionHeader eyebrow="Shop by category" title="From our kitchen to yours" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40" />)
          : categories
              ?.filter((c) => !c.parent)
              .map((cat) => (
                <Card as={Link} to={`/categories/${cat.slug}`} key={cat.id} className="group overflow-hidden p-0">
                  <div className="flex aspect-[4/3] items-center justify-center bg-leaf-100 text-leaf-600">
                    {cat.image ? (
                      <img src={cat.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-serif text-2xl">{cat.name[0]}</span>
                    )}
                  </div>
                  <p className="p-3 text-center text-sm font-medium text-forest-800 group-hover:text-forest-900">
                    {cat.name}
                  </p>
                </Card>
              ))}
      </div>
    </Section>
  )
}

function BestsellersSection() {
  const { data, isLoading } = useBestsellers()
  const products = data?.results ?? []
  if (!isLoading && products.length === 0) return null
  return (
    <Section spacing="lg">
      <SectionHeader eyebrow="Loved by our customers" title="Best sellers" />
      <ProductGrid>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)
          : products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
      </ProductGrid>
    </Section>
  )
}

function ProcessStorySection({ section }) {
  const steps = section?.content?.steps || [
    { title: 'Sourcing', body: 'Ingredients sourced directly from trusted farmers and rural producers.' },
    { title: 'Cleaning', body: 'Raw material is cleaned and sorted by hand.' },
    { title: 'Wood pressing / Bilona churning', body: 'Slow, traditional extraction preserves aroma and nutrients.' },
    { title: 'Settling & filtering', body: 'Natural settling and filtering, without chemical refining.' },
    { title: 'Inspection', body: 'Every batch is checked for quality before packaging.' },
    { title: 'Packaging & delivery', body: 'Sealed and shipped to protect purity in transit.' },
  ]
  return (
    <Section spacing="lg" className="bg-cream">
      <SectionHeader eyebrow="How we make it" title={section?.title || 'The Traditional Process'} subtitle={section?.body} />
      <ol className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={i} className="rounded-2xl bg-white p-5 shadow-sm">
            <span className="font-serif text-2xl text-ghee-500">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 text-lg text-forest-800">{step.title}</h3>
            <p className="mt-1 text-sm text-earth-700">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function ProductFocusSection({ section }) {
  const { data: product } = useProduct('wood-pressed-coconut-oil')
  if (!product) return null
  return (
    <Section spacing="lg">
      <div className="grid items-center gap-8 rounded-3xl bg-forest-50 p-8 md:grid-cols-2">
        <img
          src={product.images?.[0]?.image}
          alt={product.name}
          className="aspect-square w-full rounded-2xl object-cover shadow-lg"
        />
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-leaf-600">Product in focus</p>
          <h2 className="mt-1 text-3xl">{section?.title || product.name}</h2>
          <p className="mt-3 text-earth-700">{section?.body || product.short_description}</p>
          <Button as={Link} to={`/products/${product.slug}`} size="lg" className="mt-6">
            Explore {product.name}
          </Button>
        </div>
      </div>
    </Section>
  )
}

function WhyEkasSection({ section }) {
  const points = section?.content?.points || [
    'Purity and transparency in every batch',
    'Ethical sourcing that supports farmers directly',
    'Rural women-led production and packaging',
    'Traceability from source to shelf',
  ]
  return (
    <Section spacing="lg">
      <SectionHeader eyebrow="Why EKAS" title={section?.title || 'Why choose EKAS'} subtitle={section?.body} />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {points.map((point, i) => (
          <Card key={i} className="p-5 text-sm font-medium text-forest-800">
            {point}
          </Card>
        ))}
      </div>
    </Section>
  )
}

function WomenLedSection({ section }) {
  return (
    <Section spacing="lg" className="bg-terracotta-300/10" containerClassName="grid items-center gap-8 md:grid-cols-2">
      {section?.image && <img src={section.image} alt="" className="aspect-video w-full rounded-2xl object-cover" />}
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-terracotta-700">Women-led</p>
        <h2 className="mt-1 text-3xl">{section?.title || 'Women Behind EKAS'}</h2>
        <p className="mt-3 text-earth-700">{section?.body}</p>
        <Button as={Link} to="/women-behind-ekas" variant="outline" className="mt-6">
          Read their story
        </Button>
      </div>
    </Section>
  )
}

function CombosSection() {
  const { data } = useBundles()
  const bundles = data?.results ?? data ?? []
  if (!bundles?.length) return null
  return (
    <Section spacing="lg">
      <SectionHeader eyebrow="Save more" title="Combo packs & savings" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {bundles.slice(0, 3).map((bundle) => (
          <Card as={Link} to={`/combos/${bundle.slug}`} key={bundle.id} className="p-5">
            <h3 className="text-lg text-forest-800">{bundle.name}</h3>
            <p className="mt-1 text-sm text-earth-700">{bundle.description}</p>
            <p className="mt-3 font-semibold text-forest-800">₹{Number(bundle.bundle_price).toFixed(0)}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

function RecipesSection() {
  const { data } = useRecipes()
  const recipes = data?.results ?? data ?? []
  if (!recipes?.length) return null
  return (
    <Section spacing="lg" className="bg-forest-50/60">
      <SectionHeader eyebrow="From our kitchen" title="Recipe inspiration" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {recipes.slice(0, 3).map((recipe) => (
          <Card as={Link} to={`/recipes/${recipe.slug}`} key={recipe.id} className="overflow-hidden p-0">
            {recipe.image && <img src={recipe.image} alt="" className="aspect-video w-full object-cover" />}
            <div className="p-4">
              <h3 className="text-lg text-forest-800">{recipe.title}</h3>
              <p className="mt-1 text-sm text-earth-700">
                {recipe.prep_time_minutes + recipe.cook_time_minutes} min · Serves {recipe.servings}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

function TestimonialsSection({ section }) {
  const testimonials = section?.content?.testimonials
  if (!testimonials?.length) return null
  return (
    <Section spacing="lg">
      <SectionHeader eyebrow="Verified reviews" title={section?.title || 'What our customers say'} />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Card key={i} className="p-5">
            <p className="text-sm text-earth-700">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-3 text-sm font-medium text-forest-800">
              {t.name} {t.verified && <span className="text-xs text-leaf-600">· Verified purchase</span>}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

function ImpactSection({ section }) {
  const stats = section?.content?.stats
  if (!stats?.length) return null
  return (
    <Section spacing="lg" className="bg-forest-800 text-ivory" containerClassName="text-center">
      <SectionHeader eyebrow="Our impact" title={section?.title || 'Evidence-based impact'} />
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="font-serif text-4xl text-ghee-300">{s.value}</p>
            <p className="mt-1 text-sm text-ivory/80">{s.label}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default function Home() {
  const { data } = useHomepageContent()
  const sections = data?.sections ?? []

  return (
    <div>
      <Seo title="EKAS Healthy Foods — Pure. Traditional. Empowering." description="Traditionally prepared A2 ghee, wood-pressed oils, and raw honey from EKAS Healthy Foods." />
      <HeroSection section={findSection(sections, 'hero')} />
      <TrustStrip section={findSection(sections, 'trust_strip')} />
      <CategoryGrid />
      <BestsellersSection />
      <ProductFocusSection section={findSection(sections, 'product_focus')} />
      <ProcessStorySection section={findSection(sections, 'process_story')} />
      <WhyEkasSection section={findSection(sections, 'why_ekas')} />
      <WomenLedSection section={findSection(sections, 'women_led')} />
      <CombosSection />
      <RecipesSection />
      <TestimonialsSection section={findSection(sections, 'testimonials')} />
      <ImpactSection section={findSection(sections, 'impact')} />
    </div>
  )
}
