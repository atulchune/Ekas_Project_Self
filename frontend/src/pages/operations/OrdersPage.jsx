import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { opsOrders } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Badge, Select } from '@/components/ui/primitives'

const STATUS_TONE = {
  confirmed: 'forest',
  delivered: 'forest',
  cancelled: 'terracotta',
  payment_failed: 'terracotta',
  pending_payment: 'ghee',
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data, isLoading } = opsOrders.useList({ page, search, status: status || undefined })
  const navigate = useNavigate()

  const columns = [
    { key: 'order_number', header: 'Order #' },
    { key: 'customer_email', header: 'Customer' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={STATUS_TONE[row.status] || 'earth'} className="capitalize">
          {row.status.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    { key: 'payment_method', header: 'Payment' },
    { key: 'total', header: 'Total', render: (row) => `₹${row.total}` },
    { key: 'placed_at', header: 'Placed', render: (row) => new Date(row.placed_at).toLocaleDateString() },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-forest-800">Orders</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="">All statuses</option>
          {['pending_payment', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'payment_failed', 'refunded'].map(
            (s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            )
          )}
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.results}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        page={page}
        onPageChange={setPage}
        numPages={data?.num_pages}
        exportFilename="orders.csv"
        rowActions={(row) => (
          <button className="text-sm text-forest-700 underline" onClick={() => navigate(`/operations/orders/${row.order_number}`)}>
            View
          </button>
        )}
      />
    </div>
  )
}
