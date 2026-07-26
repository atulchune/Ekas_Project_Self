import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApplyCoupon, useCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart'
import { useMe } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, EmptyState, Input, PriceTag } from '@/components/ui/primitives'
import { PageLoader } from '@/components/ui/PageLoader'
import { Seo } from '@/components/storefront/Seo'
import { Section, SidebarLayout } from '@/components/ui/layout'
import { extractErrorMessage } from '@/lib/apiClient'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const { data: me } = useMe()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const applyCoupon = useApplyCoupon()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState(null)
  const navigate = useNavigate()

  if (isLoading) return <PageLoader />

  const items = cart?.items ?? []
  const pricing = cart?.pricing

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    setCouponError(null)
    applyCoupon.mutate(couponCode, {
      onError: (err) => setCouponError(extractErrorMessage(err, 'Invalid coupon code')),
    })
  }

  const handleCheckout = () => {
    navigate(me ? '/checkout' : '/login', { state: { from: { pathname: '/checkout' } } })
  }

  if (items.length === 0) {
    return (
      <Section size="narrow" spacing="xl">
        <Seo title="Your Cart — EKAS Healthy Foods" />
        <EmptyState
          title="Your cart is empty"
          description="Add some traditionally prepared foods to get started."
          action={
            <Button as={Link} to="/products">
              Shop Now
            </Button>
          }
        />
      </Section>
    )
  }

  return (
    <Section size="default" spacing="md">
      <Seo title="Your Cart — EKAS Healthy Foods" />
      <h1 className="text-3xl">Your Cart</h1>
      <SidebarLayout
        className="mt-8"
        stickyAside
        aside={
          <Card className="p-5">
            <h2 className="text-lg">Order Summary</h2>
            <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2">
              <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <Button type="submit" variant="outline" loading={applyCoupon.isPending}>
                Apply
              </Button>
            </form>
            {couponError && <p className="mt-1 text-xs text-terracotta-700">{couponError}</p>}

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-earth-600">Subtotal</dt>
                <dd>₹{Number(pricing?.subtotal ?? 0).toFixed(0)}</dd>
              </div>
              {pricing?.discount_total > 0 && (
                <div className="flex justify-between text-leaf-600">
                  <dt>Discount</dt>
                  <dd>−₹{Number(pricing.discount_total).toFixed(0)}</dd>
                </div>
              )}
              <div className="flex justify-between text-xs text-earth-500">
                <dt>Shipping & tax</dt>
                <dd>Calculated at checkout</dd>
              </div>
            </dl>
            <Button className="mt-5 w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </Card>
        }
      >
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4">
              <div className="min-w-0 flex-1">
                <Link to={`/products/${item.product_slug}`} className="font-medium text-forest-800 hover:underline">
                  {item.product_name}
                </Link>
                {item.bundle_name && <p className="text-xs text-leaf-600">Part of {item.bundle_name} combo</p>}
                <p className="text-sm text-earth-600">{item.variant.label}</p>
                <PriceTag price={item.variant.price} mrp={item.variant.mrp} />
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-forest-200">
                    <button
                      className="px-2.5 py-1"
                      aria-label="Decrease quantity"
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      className="px-2.5 py-1"
                      aria-label="Increase quantity"
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    >
                      +
                    </button>
                  </div>
                  <button className="text-sm text-terracotta-700 underline" onClick={() => removeItem.mutate(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-medium text-forest-800">₹{Number(item.line_total).toFixed(0)}</p>
            </Card>
          ))}
        </div>
      </SidebarLayout>
    </Section>
  )
}
