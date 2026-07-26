import { Link } from 'react-router-dom'
import { useBundles } from '@/hooks/useCatalog'
import { Card, EmptyState, Skeleton } from '@/components/ui/primitives'
import { Section, PageHeader } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function CombosList() {
  const { data, isLoading } = useBundles()
  const bundles = data?.results ?? data ?? []

  return (
    <Section size="wide" spacing="md">
      <Seo title="Combo Packs — EKAS Healthy Foods" description="Curated combo packs and savings from EKAS Healthy Foods." />
      <PageHeader title="Combo Packs & Savings" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)
          : bundles.map((bundle) => (
              <Card as={Link} to={`/combos/${bundle.slug}`} key={bundle.id} className="overflow-hidden p-0">
                {bundle.image && <img src={bundle.image} alt="" className="aspect-video w-full object-cover" />}
                <div className="p-5">
                  <h2 className="text-lg text-forest-800">{bundle.name}</h2>
                  <p className="mt-1 text-sm text-earth-700">{bundle.description}</p>
                  <p className="mt-3 font-semibold text-forest-800">₹{Number(bundle.bundle_price).toFixed(0)}</p>
                </div>
              </Card>
            ))}
      </div>
      {!isLoading && bundles.length === 0 && (
        <EmptyState title="No combo packs yet" description="Check back soon for curated bundles." />
      )}
    </Section>
  )
}
