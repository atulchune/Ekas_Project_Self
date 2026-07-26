import { useState } from 'react'
import { opsPayments } from '@/hooks/opsResources'
import { DataTable } from '@/components/operations/DataTable'
import { Badge } from '@/components/ui/primitives'

const TONE = { captured: 'forest', failed: 'terracotta', created: 'ghee', refunded: 'earth' }

export default function PaymentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = opsPayments.useList({ page, search })

  const columns = [
    { key: 'order_number', header: 'Order #' },
    { key: 'provider', header: 'Provider' },
    { key: 'amount', header: 'Amount', render: (row) => `₹${row.amount}` },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={TONE[row.status] || 'earth'}>{row.status}</Badge> },
    { key: 'provider_payment_id', header: 'Payment ID' },
    { key: 'created_at', header: 'Date', render: (row) => new Date(row.created_at).toLocaleString() },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Payments</h1>
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
        exportFilename="payments.csv"
      />
    </div>
  )
}
