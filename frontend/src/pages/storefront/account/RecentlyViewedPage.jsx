import { useRecentlyViewed } from '@/hooks/useCart'
import { ProductCard } from '@/components/storefront/ProductCard'
import { EmptyState } from '@/components/ui/primitives'
import { ProductGrid } from '@/components/ui/layout'

export default function RecentlyViewedPage() {
  const { data, isLoading } = useRecentlyViewed()

  if (!isLoading && data?.length === 0) {
    return <EmptyState title="Nothing viewed yet" description="Products you view will appear here." />
  }

  return (
    <ProductGrid>
      {data?.map((item) => (
        <ProductCard key={item.id} product={item.product} />
      ))}
    </ProductGrid>
  )
}
