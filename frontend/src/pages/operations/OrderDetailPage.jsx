import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { opsOrderNotes, opsRefunds } from '@/hooks/opsResources'
import { opsApi, extractErrorMessage } from '@/lib/apiClient'
import { useQuery } from '@tanstack/react-query'
import { Badge, Card, Field, Input, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

const TRANSITIONS = {
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'delivered'],
  out_for_delivery: ['delivered'],
}

export default function OrderDetailPage() {
  const { orderNumber } = useParams()
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'orders.manage')

  const { data: order, isLoading } = useQuery({
    queryKey: ['ops-order', orderNumber],
    queryFn: async () => (await opsApi.get(`/orders/${orderNumber}/`)).data,
  })
  const { data: notes } = opsOrderNotes.useList({ order: order?.id })
  const createNote = opsOrderNotes.useCreate()
  const createRefund = opsRefunds.useCreate()

  const [note, setNote] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [transitioning, setTransitioning] = useState(false)

  if (isLoading) return <PageLoader />
  if (!order) return null

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['ops-order', orderNumber] })
    qc.invalidateQueries({ queryKey: ['ops-orders', 'list'] })
  }

  const handleTransition = async (status) => {
    setTransitioning(true)
    try {
      await opsApi.post(`/orders/${orderNumber}/transition/`, { status })
      refresh()
      pushToast(`Order moved to ${status.replace(/_/g, ' ')}`)
    } catch (err) {
      pushToast(extractErrorMessage(err), 'error')
    } finally {
      setTransitioning(false)
    }
  }

  const handleCancel = async () => {
    const reason = window.prompt('Reason for cancellation?')
    if (reason === null) return
    try {
      await opsApi.post(`/orders/${orderNumber}/cancel/`, { reason })
      refresh()
      pushToast('Order cancelled')
    } catch (err) {
      pushToast(extractErrorMessage(err), 'error')
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    await createNote.mutateAsync({ order: order.id, note })
    setNote('')
  }

  const handleRefund = async (e) => {
    e.preventDefault()
    try {
      await createRefund.mutateAsync({ order: order.id, amount: refundAmount, reason: refundReason })
      refresh()
      setRefundAmount('')
      setRefundReason('')
      pushToast('Refund processed')
    } catch (err) {
      pushToast(extractErrorMessage(err), 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-forest-800">{order.order_number}</h1>
          <p className="text-sm text-earth-500">{order.customer_email}</p>
        </div>
        <Badge tone="forest" className="capitalize">
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {canManage && (
        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(TRANSITIONS[order.status] || []).map((next) => (
              <Button key={next} size="sm" variant={next === 'cancelled' ? 'danger' : 'secondary'} onClick={() => (next === 'cancelled' ? handleCancel() : handleTransition(next))} loading={transitioning}>
                Move to {next.replace(/_/g, ' ')}
              </Button>
            ))}
            {!TRANSITIONS[order.status] && !['cancelled', 'delivered', 'refunded'].includes(order.status) && (
              <Button size="sm" variant="danger" onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Line Items</h2>
        <ul className="mt-3 divide-y divide-forest-50 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>
                {item.product_name} ({item.variant_label}) × {item.quantity}
              </span>
              <span>₹{item.line_total}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-forest-100 pt-2 font-semibold text-forest-800">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Shipping Address</h2>
        <p className="mt-2 text-sm text-earth-700">
          {order.shipping_full_name} · {order.shipping_phone}
          <br />
          {order.shipping_line1}, {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Status History</h2>
        <ol className="mt-3 space-y-2 text-sm">
          {order.status_history.map((h) => (
            <li key={h.id}>
              <span className="font-medium capitalize text-forest-800">{h.to_status.replace(/_/g, ' ')}</span>{' '}
              <span className="text-earth-500">{new Date(h.created_at).toLocaleString()}</span>
              {h.note && <p className="text-earth-600">{h.note}</p>}
            </li>
          ))}
        </ol>
      </Card>

      {canManage && (
        <Card className="p-5">
          <h2 className="text-lg text-forest-800">Issue Refund</h2>
          <form onSubmit={handleRefund} className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Amount" htmlFor="refund_amount">
              <Input id="refund_amount" type="number" required value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
            </Field>
            <Field label="Reason" htmlFor="refund_reason" className="sm:col-span-2">
              <Input id="refund_reason" required value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
            </Field>
            <div className="sm:col-span-3">
              <Button type="submit" variant="outline" loading={createRefund.isPending}>
                Process Refund
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-lg text-forest-800">Internal Notes</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notes?.results?.map((n) => (
            <li key={n.id} className="rounded-lg bg-forest-50 p-2">
              <p>{n.note}</p>
              <p className="mt-1 text-xs text-earth-500">
                {n.staff_name} · {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note (not visible to customer)" />
          <Button type="submit" variant="outline" loading={createNote.isPending}>
            Add
          </Button>
        </form>
      </Card>
    </div>
  )
}
