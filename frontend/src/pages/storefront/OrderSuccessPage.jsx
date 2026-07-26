import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { Seo } from '@/components/storefront/Seo'

export default function OrderSuccessPage() {
  const { orderNumber } = useParams()
  const { data: order, isLoading } = useOrder(orderNumber)

  if (isLoading) return <PageLoader />
  if (!order) return null

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <Seo title="Order Confirmed — EKAS Healthy Foods" />
      <CheckCircle2 className="mx-auto size-16 text-leaf-500" aria-hidden="true" />
      <h1 className="mt-4 text-3xl">Thank you for your order!</h1>
      <p className="mt-2 text-earth-700">
        Your order <strong>{order.order_number}</strong> has been {order.status === 'confirmed' ? 'confirmed' : 'received'}.
        We&apos;ll send updates to your email.
      </p>
      <p className="mt-1 text-lg font-semibold text-forest-800">Total: ₹{Number(order.total).toFixed(0)}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button as={Link} to={`/account/orders/${order.order_number}`}>
          Track Order
        </Button>
        <Button as={Link} to="/products" variant="outline">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
