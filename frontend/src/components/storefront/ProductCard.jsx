import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, PriceTag, Badge, StarRating } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { useAddToCart } from '@/hooks/useCart'
import { useUiStore } from '@/store/uiStore'

export function ProductCard({ product }) {
  const addToCart = useAddToCart()
  const pushToast = useUiStore((s) => s.pushToast)
  const variant = product.default_variant

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (!variant) return
    addToCart.mutate(
      { variantId: variant.id, quantity: 1 },
      {
        onSuccess: () => pushToast(`${product.name} added to cart`),
        onError: () => pushToast('Could not add to cart', 'error'),
      }
    )
  }

  const stockStatus = variant?.stock_status

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
      <Card as={Link} to={`/products/${product.slug}`} className="group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-cream">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-earth-300">No image</div>
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.is_bestseller && <Badge tone="ghee">Bestseller</Badge>}
            {product.is_new_launch && <Badge tone="forest">New</Badge>}
          </div>
          {stockStatus === 'out_of_stock' && (
            <div className="absolute inset-x-0 bottom-0 bg-earth-900/80 px-3 py-1.5 text-center text-xs text-ivory">
              Out of stock
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-base font-serif font-medium text-forest-800" title={product.name}>
            {product.name}
          </h3>
          {product.review_count > 0 && <StarRating value={product.average_rating} count={product.review_count} />}
          {variant && <PriceTag price={variant.price} mrp={variant.mrp} />}
          <div className="mt-auto pt-2">
            <Button
              size="sm"
              variant={stockStatus === 'out_of_stock' ? 'outline' : 'primary'}
              className="w-full"
              onClick={handleQuickAdd}
              disabled={stockStatus === 'out_of_stock'}
              loading={addToCart.isPending}
            >
              {stockStatus === 'out_of_stock' ? 'Notify me' : 'Quick add'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
