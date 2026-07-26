import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { Card, EmptyState } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'

const STATUS_TONE = {
  confirmed: 'text-forest-700',
  delivered: 'text-leaf-600',
  cancelled: 'text-terracotta-700',
  payment_failed: 'text-terracotta-700',
}

export default function OrderHistory() {
  const { data, isLoading } = useOrders()
  const orders = data?.results ?? []

  if (!isLoading && orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Once you place an order, it will show up here."
        action={
          <Button as={Link} to="/products">
            Shop Now
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} as={Link} to={`/account/orders/${order.order_number}`} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium text-forest-800">{order.order_number}</p>
            <p className="text-xs text-earth-500">{new Date(order.placed_at).toLocaleDateString()} · {order.item_count} item(s)</p>
          </div>
          <span className={`text-sm font-medium capitalize ${STATUS_TONE[order.status] || 'text-earth-700'}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
          <p className="font-medium text-forest-800">₹{Number(order.total).toFixed(0)}</p>
        </Card>
      ))}
    </div>
  )
}
