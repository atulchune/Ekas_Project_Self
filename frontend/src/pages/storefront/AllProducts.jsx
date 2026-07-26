import { useSearchParams } from 'react-router-dom'
import { useCategories, useProducts } from '@/hooks/useCatalog'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Skeleton, EmptyState, Select } from '@/components/ui/primitives'
import { Section, PageHeader, ProductGrid } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: categories } = useCategories()

  const category = searchParams.get('category') || ''
  const ordering = searchParams.get('ordering') || '-created_at'
  const page = Number(searchParams.get('page') || 1)

  const { data, isLoading } = useProducts({ category: category || undefined, ordering, page })
  const products = data?.results ?? []

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  return (
    <Section size="wide" spacing="md">
      <Seo title="Shop All Products — EKAS Healthy Foods" description="Browse EKAS ghee, wood-pressed oils, honey and combo packs." />
      <PageHeader
        title="All Products"
        subtitle={`${data?.count ?? '...'} products`}
        actions={
          <>
            <Select value={category} onChange={(e) => updateParam('category', e.target.value)} aria-label="Filter by category" className="w-auto">
              <option value="">All categories</option>
              {categories?.filter((c) => !c.parent).map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select value={ordering} onChange={(e) => updateParam('ordering', e.target.value)} aria-label="Sort products" className="w-auto">
              <option value="-created_at">Newest</option>
              <option value="name">Name: A-Z</option>
              <option value="-average_rating">Top rated</option>
            </Select>
          </>
        }
      />

      <ProductGrid className="mt-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </ProductGrid>

      {!isLoading && products.length === 0 && (
        <EmptyState title="No products found" description="Try a different category or check back soon." />
      )}

      {data && data.num_pages > 1 && (
        <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: data.num_pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam('page', String(i + 1))}
              aria-current={page === i + 1 ? 'page' : undefined}
              className={`size-9 rounded-full text-sm font-medium ${
                page === i + 1 ? 'bg-forest-700 text-ivory' : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      )}
    </Section>
  )
}
