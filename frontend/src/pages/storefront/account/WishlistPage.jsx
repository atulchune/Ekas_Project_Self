import { useToggleWishlist, useWishlist } from '@/hooks/useCart'
import { ProductCard } from '@/components/storefront/ProductCard'
import { EmptyState } from '@/components/ui/primitives'
import { ProductGrid } from '@/components/ui/layout'

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist()
  const toggleWishlist = useToggleWishlist()

  if (!isLoading && wishlist?.length === 0) {
    return <EmptyState title="Your wishlist is empty" description="Save products you love for later." />
  }

  return (
    <ProductGrid>
      {wishlist?.map((item) => (
        <div key={item.id} className="relative">
          <ProductCard product={item.product} />
          <button
            className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-terracotta-700 shadow"
            onClick={() => toggleWishlist.mutate({ wishlistItemId: item.id, add: false })}
          >
            Remove
          </button>
        </div>
      ))}
    </ProductGrid>
  )
}
