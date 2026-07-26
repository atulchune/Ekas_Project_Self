import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { useMe } from '@/hooks/useAuth'
import { Card } from '@/components/ui/primitives'

export default function AccountDashboard() {
  const { data: ordersData } = useOrders({ page_size: 3 })
  const { data: me } = useMe()

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="text-lg">Account Overview</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-earth-500">Total orders</dt>
            <dd className="text-lg font-semibold text-forest-800">{me?.total_orders ?? 0}</dd>
          </div>
          <div>
            <dt className="text-earth-500">Total spent</dt>
            <dd className="text-lg font-semibold text-forest-800">₹{Number(me?.total_spent ?? 0).toFixed(0)}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Recent Orders</h2>
          <Link to="/account/orders" className="text-sm text-forest-700 underline">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {ordersData?.results?.length ? (
            ordersData.results.map((o) => (
              <Link key={o.id} to={`/account/orders/${o.order_number}`} className="flex justify-between rounded-lg border border-forest-100 p-3 text-sm hover:bg-forest-50">
                <span>{o.order_number}</span>
                <span className="capitalize">{o.status.replace('_', ' ')}</span>
                <span>₹{Number(o.total).toFixed(0)}</span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-earth-600">No orders yet.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
