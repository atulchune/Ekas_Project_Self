import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useCatalog'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Skeleton, EmptyState } from '@/components/ui/primitives'
import { Section, PageHeader, ProductGrid } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const { data, isLoading } = useProducts({ search: q })
  const products = data?.results ?? []

  return (
    <Section size="wide" spacing="md">
      <Seo title={`Search: ${q} — EKAS Healthy Foods`} />
      <PageHeader title={`Search results for "${q}"`} subtitle={`${data?.count ?? 0} results`} />

      <ProductGrid className="mt-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </ProductGrid>
      {!isLoading && products.length === 0 && (
        <EmptyState title="No matches found" description="Try a different search term." />
      )}
    </Section>
  )
}
