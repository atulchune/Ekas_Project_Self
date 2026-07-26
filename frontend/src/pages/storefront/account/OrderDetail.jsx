import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCancelOrder, useOrder } from '@/hooks/useOrders'
import { Badge, Card } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { useUiStore } from '@/store/uiStore'

const CANCELLABLE = ['confirmed', 'packed', 'pending_payment']

export default function OrderDetail() {
  const { orderNumber } = useParams()
  const { data: order, isLoading } = useOrder(orderNumber)
  const cancelOrder = useCancelOrder()
  const pushToast = useUiStore((s) => s.pushToast)
  const [reason, setReason] = useState('')
  const [showCancelForm, setShowCancelForm] = useState(false)

  if (isLoading) return <PageLoader />
  if (!order) return null

  const handleCancel = () => {
    cancelOrder.mutate(
      { orderNumber, reason },
      {
        onSuccess: () => {
          pushToast('Cancellation processed')
          setShowCancelForm(false)
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg">{order.order_number}</h2>
            <p className="text-sm text-earth-500">Placed {new Date(order.placed_at).toLocaleString()}</p>
          </div>
          <Badge tone="forest" className="capitalize">
            {order.status.replace(/_/g, ' ')}
          </Badge>
        </div>

        <ul className="mt-4 divide-y divide-forest-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.product_name} ({item.variant_label}) × {item.quantity}
              </span>
              <span>₹{Number(item.line_total).toFixed(0)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1 border-t border-forest-100 pt-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>₹{Number(order.subtotal).toFixed(0)}</dd>
          </div>
          {Number(order.discount_total) > 0 && (
            <div className="flex justify-between text-leaf-600">
              <dt>Discount</dt>
              <dd>−₹{Number(order.discount_total).toFixed(0)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>₹{Number(order.shipping_fee).toFixed(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>₹{Number(order.tax_total).toFixed(0)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-forest-800">
            <dt>Total</dt>
            <dd>₹{Number(order.total).toFixed(0)}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <h3 className="text-lg">Shipping Address</h3>
        <p className="mt-2 text-sm text-earth-700">
          {order.shipping_full_name} · {order.shipping_phone}
          <br />
          {order.shipping_line1}, {order.shipping_line2 && `${order.shipping_line2}, `}
          {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
        </p>
      </Card>

      {order.tracking && (
        <Card className="p-5">
          <h3 className="text-lg">Tracking</h3>
          <p className="mt-2 text-sm text-earth-700 capitalize">Status: {order.tracking.status.replace(/_/g, ' ')}</p>
          {order.tracking.courier_name && <p className="text-sm text-earth-700">Courier: {order.tracking.courier_name}</p>}
          {order.tracking.tracking_number && <p className="text-sm text-earth-700">Tracking #: {order.tracking.tracking_number}</p>}
          {order.tracking.tracking_url && (
            <a href={order.tracking.tracking_url} className="text-sm text-forest-700 underline" target="_blank" rel="noreferrer">
              Track shipment
            </a>
          )}
        </Card>
      )}

      <Card className="p-5">
        <h3 className="text-lg">Order Timeline</h3>
        <ol className="mt-3 space-y-2 border-l border-forest-200 pl-4 text-sm">
          {order.status_history.map((h) => (
            <li key={h.id} className="relative">
              <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-forest-600" />
              <span className="font-medium capitalize text-forest-800">{h.to_status.replace(/_/g, ' ')}</span>
              <span className="ml-2 text-earth-500">{new Date(h.created_at).toLocaleString()}</span>
              {h.note && <p className="text-earth-600">{h.note}</p>}
            </li>
          ))}
        </ol>
      </Card>

      {CANCELLABLE.includes(order.status) && (
        <Card className="p-5">
          {showCancelForm ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium" htmlFor="reason">
                Reason for cancellation
              </label>
              <textarea
                id="reason"
                className="w-full rounded-lg border border-forest-200 p-2 text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button variant="danger" onClick={handleCancel} loading={cancelOrder.isPending}>
                  Confirm Cancellation
                </Button>
                <Button variant="ghost" onClick={() => setShowCancelForm(false)}>
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowCancelForm(true)}>
              Request Cancellation
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
