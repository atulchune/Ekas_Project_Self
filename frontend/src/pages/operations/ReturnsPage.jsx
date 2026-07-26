import { useState } from 'react'
import { opsCancellationRequests, opsRefunds } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Badge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

export default function ReturnsPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'returns.manage')
  const pushToast = useUiStore((s) => s.pushToast)
  const [tab, setTab] = useState('requests')

  const requests = opsCancellationRequests.useList()
  const refunds = opsRefunds.useList()
  const updateRequest = opsCancellationRequests.useUpdate()

  const handleResolve = (id, status) => {
    updateRequest.mutate(
      { id, status },
      { onSuccess: () => pushToast(status === 'approved' ? 'Cancellation approved' : 'Cancellation rejected') }
    )
  }

  const requestColumns = [
    { key: 'order_number', header: 'Order #' },
    { key: 'customer_email', header: 'Customer' },
    { key: 'reason', header: 'Reason' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone="ghee" className="capitalize">{row.status}</Badge> },
  ]

  const refundColumns = [
    { key: 'order_number', header: 'Order #' },
    { key: 'amount', header: 'Amount', render: (row) => `₹${row.amount}` },
    { key: 'reason', header: 'Reason' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone="forest" className="capitalize">{row.status}</Badge> },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Returns & Refunds</h1>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={tab === 'requests' ? 'primary' : 'outline'} onClick={() => setTab('requests')}>
          Cancellation Requests
        </Button>
        <Button size="sm" variant={tab === 'refunds' ? 'primary' : 'outline'} onClick={() => setTab('refunds')}>
          Refunds
        </Button>
      </div>

      {tab === 'requests' ? (
        <DataTable
          columns={requestColumns}
          data={requests.data?.results}
          isLoading={requests.isLoading}
          exportFilename="cancellation-requests.csv"
          rowActions={(row) =>
            canManage &&
            row.status === 'requested' && (
              <div className="flex justify-end gap-3">
                <button className="text-sm text-forest-700 underline" onClick={() => handleResolve(row.id, 'approved')}>
                  Approve
                </button>
                <button className="text-sm text-terracotta-700 underline" onClick={() => handleResolve(row.id, 'rejected')}>
                  Reject
                </button>
              </div>
            )
          }
        />
      ) : (
        <DataTable columns={refundColumns} data={refunds.data?.results} isLoading={refunds.isLoading} exportFilename="refunds.csv" />
      )}
    </div>
  )
}
