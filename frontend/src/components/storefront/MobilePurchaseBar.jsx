import { useUiStore } from '@/store/uiStore'
import { PriceTag } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'

export function MobilePurchaseBarPortal() {
  const bar = useUiStore((s) => s.stickyBuyBar)
  if (!bar) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-forest-100 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:hidden">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-earth-900">{bar.name}</p>
        <PriceTag price={bar.price} mrp={bar.mrp} />
      </div>
      <Button size="sm" onClick={bar.onAddToCart} loading={bar.loading} disabled={bar.disabled}>
        {bar.disabled ? 'Out of stock' : 'Add to cart'}
      </Button>
    </div>
  )
}
