import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddresses, useSaveAddress } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useCheckout, useMockSimulatePayment, useVerifyPayment } from '@/hooks/useOrders'
import { Button } from '@/components/ui/Button'
import { Card, EmptyState } from '@/components/ui/primitives'
import { PageLoader } from '@/components/ui/PageLoader'
import { AddressForm } from '@/components/storefront/AddressForm'
import { Seo } from '@/components/storefront/Seo'
import { Section, SidebarLayout } from '@/components/ui/layout'
import { useUiStore } from '@/store/uiStore'
import { extractErrorMessage } from '@/lib/apiClient'
import { loadRazorpayScript } from '@/lib/razorpay'

export default function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: addresses, isLoading: addressesLoading } = useAddresses()
  const saveAddress = useSaveAddress()
  const checkout = useCheckout()
  const verifyPayment = useVerifyPayment()
  const mockSimulate = useMockSimulatePayment()
  const pushToast = useUiStore((s) => s.pushToast)
  const navigate = useNavigate()

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [error, setError] = useState(null)
  const [placing, setPlacing] = useState(false)

  if (cartLoading || addressesLoading) return <PageLoader />

  const defaultAddress = addresses?.find((a) => a.is_default) ?? addresses?.[0]
  const activeAddressId = selectedAddressId ?? defaultAddress?.id

  if (!cart?.items?.length) {
    return (
      <Section size="narrow" spacing="xl">
        <EmptyState title="Your cart is empty" description="Add products before checking out." />
      </Section>
    )
  }

  const handleSaveAddress = (payload) => {
    saveAddress.mutate(payload, {
      onSuccess: (res) => {
        setSelectedAddressId(res.data.id)
        setShowAddressForm(false)
      },
    })
  }

  const handlePlaceOrder = async () => {
    if (!activeAddressId) {
      setError('Please add a delivery address.')
      return
    }
    setError(null)
    setPlacing(true)
    try {
      const idempotencyKey = crypto.randomUUID()
      const order = await checkout.mutateAsync({
        address_id: activeAddressId,
        payment_method: paymentMethod,
        coupon_code: cart.coupon_code || undefined,
        idempotency_key: idempotencyKey,
      })

      if (paymentMethod === 'cod') {
        navigate(`/order-success/${order.order_number}`)
        return
      }

      // Online payment.
      if (order.payment?.key_id === 'mock_key') {
        const sim = await mockSimulate.mutateAsync(order.order_number)
        await verifyPayment.mutateAsync({
          order_number: order.order_number,
          provider_order_id: sim.provider_order_id,
          provider_payment_id: sim.provider_payment_id,
          signature: sim.signature,
        })
        navigate(`/order-success/${order.order_number}`)
        return
      }

      await loadRazorpayScript()
      const rzp = new window.Razorpay({
        key: order.payment.key_id,
        amount: Math.round(order.payment.amount * 100),
        currency: order.payment.currency,
        name: 'EKAS Healthy Foods',
        description: `Order ${order.order_number}`,
        order_id: order.payment.provider_order_id,
        handler: async (response) => {
          await verifyPayment.mutateAsync({
            order_number: order.order_number,
            provider_order_id: response.razorpay_order_id,
            provider_payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })
          navigate(`/order-success/${order.order_number}`)
        },
        modal: {
          ondismiss: () => {
            pushToast('Payment cancelled. Your order is saved as pending payment.', 'error')
            navigate(`/account/orders/${order.order_number}`)
          },
        },
      })
      rzp.open()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not place your order. Please try again.'))
    } finally {
      setPlacing(false)
    }
  }

  return (
    <Section size="default" spacing="md">
      <Seo title="Checkout — EKAS Healthy Foods" />
      <h1 className="text-3xl">Checkout</h1>

      <SidebarLayout
        className="mt-8"
        stickyAside
        aside={
          <Card className="p-5">
            <h2 className="text-lg">Order Summary</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-earth-600">Subtotal</dt>
                <dd>₹{Number(cart.pricing?.subtotal ?? 0).toFixed(0)}</dd>
              </div>
              {cart.pricing?.discount_total > 0 && (
                <div className="flex justify-between text-leaf-600">
                  <dt>Discount</dt>
                  <dd>−₹{Number(cart.pricing.discount_total).toFixed(0)}</dd>
                </div>
              )}
              <div className="flex justify-between text-xs text-earth-500">
                <dt>Shipping & tax</dt>
                <dd>Calculated on order confirmation</dd>
              </div>
            </dl>
            <Button className="mt-5 w-full" size="lg" onClick={handlePlaceOrder} loading={placing || checkout.isPending}>
              Place Order
            </Button>
          </Card>
        }
      >
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">Delivery Address</h2>
              <button className="text-sm font-medium text-forest-700 underline" onClick={() => setShowAddressForm((s) => !s)}>
                {showAddressForm ? 'Cancel' : 'Add new'}
              </button>
            </div>

            {showAddressForm ? (
              <div className="mt-4">
                <AddressForm onSubmit={handleSaveAddress} isSubmitting={saveAddress.isPending} />
              </div>
            ) : addresses?.length ? (
              <div className="mt-4 space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                      activeAddressId === addr.id ? 'border-forest-700 bg-forest-50' : 'border-forest-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1"
                      checked={activeAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <span className="text-sm">
                      <strong className="text-forest-800">{addr.full_name}</strong> · {addr.phone}
                      <br />
                      {addr.line1}, {addr.line2 && `${addr.line2}, `}
                      {addr.city}, {addr.state} {addr.pincode}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-earth-600">No saved addresses. Add one to continue.</p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-lg">Payment Method</h2>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-3 rounded-xl border border-forest-100 p-3 text-sm">
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-forest-100 p-3 text-sm">
                <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                Online Payment (UPI / Card / Netbanking)
              </label>
            </div>
          </Card>

          {error && <p className="text-sm text-terracotta-700" role="alert">{error}</p>}
        </div>
      </SidebarLayout>
    </Section>
  )
}
