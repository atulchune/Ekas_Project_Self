import { useParams } from 'react-router-dom'
import { useCategories, useProducts } from '@/hooks/useCatalog'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Skeleton, EmptyState } from '@/components/ui/primitives'
import { Section, PageHeader, ProductGrid } from '@/components/ui/layout'
import { Seo } from '@/components/storefront/Seo'

export default function CategoryPage() {
  const { slug } = useParams()
  const { data: categories } = useCategories()
  const category = categories?.find((c) => c.slug === slug)
  const { data, isLoading } = useProducts({ category: slug })
  const products = data?.results ?? []

  return (
    <Section size="wide" spacing="md">
      <Seo title={`${category?.name || 'Category'} — EKAS Healthy Foods`} description={category?.description} />
      <PageHeader title={category?.name || 'Category'} subtitle={category?.description} />

      <ProductGrid className="mt-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </ProductGrid>
      {!isLoading && products.length === 0 && (
        <EmptyState title="No products in this category yet" description="Check back soon for new arrivals." />
      )}
    </Section>
  )
}
