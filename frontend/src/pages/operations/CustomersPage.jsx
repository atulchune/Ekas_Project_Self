import { useState } from 'react'
import { opsCustomers } from '@/hooks/opsResources'
import { opsApi } from '@/lib/apiClient'
import { useQueryClient } from '@tanstack/react-query'
import { DataTable } from '@/components/operations/DataTable'
import { Drawer } from '@/components/operations/Drawer'
import { Badge, Textarea } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { hasPermission, useOpsMe } from '@/hooks/useOpsAuth'
import { useUiStore } from '@/store/uiStore'

function CustomerDetail({ customer, onClose, canManage }) {
  const qc = useQueryClient()
  const pushToast = useUiStore((s) => s.pushToast)
  const [notes, setNotes] = useState(customer.internal_notes || '')

  const saveNotes = async () => {
    await opsApi.patch(`/customers/${customer.id}/`, { internal_notes: notes })
    qc.invalidateQueries({ queryKey: ['ops-customers', 'list'] })
    pushToast('Notes saved')
  }

  const toggleActive = async () => {
    await opsApi.post(`/customers/${customer.id}/deactivate/`, { is_active: !customer.is_active })
    qc.invalidateQueries({ queryKey: ['ops-customers', 'list'] })
    pushToast(customer.is_active ? 'Customer deactivated' : 'Customer reactivated')
    onClose()
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-forest-800">{customer.full_name || customer.email}</p>
        <p className="text-sm text-earth-600">{customer.email}</p>
        <p className="text-sm text-earth-600">{customer.phone}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-earth-500">Total orders</dt>
          <dd className="font-medium">{customer.total_orders}</dd>
        </div>
        <div>
          <dt className="text-earth-500">Total spent</dt>
          <dd className="font-medium">₹{customer.total_spent}</dd>
        </div>
      </dl>
      <div>
        <h3 className="text-sm font-semibold text-forest-800">Addresses</h3>
        <ul className="mt-2 space-y-1 text-sm text-earth-700">
          {customer.addresses?.map((a) => (
            <li key={a.id}>
              {a.line1}, {a.city}, {a.state} {a.pincode}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-forest-800">Internal Notes</h3>
        <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" />
        <Button size="sm" variant="outline" className="mt-2" onClick={saveNotes}>
          Save Notes
        </Button>
      </div>
      {canManage && (
        <Button variant={customer.is_active ? 'danger' : 'primary'} onClick={toggleActive}>
          {customer.is_active ? 'Deactivate Account' : 'Reactivate Account'}
        </Button>
      )}
    </div>
  )
}

export default function CustomersPage() {
  const { data: me } = useOpsMe()
  const canManage = hasPermission(me, 'customers.manage')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = opsCustomers.useList({ page, search })
  const [selected, setSelected] = useState(null)

  const columns = [
    { key: 'email', header: 'Email' },
    { key: 'full_name', header: 'Name' },
    { key: 'total_orders', header: 'Orders' },
    { key: 'total_spent', header: 'Spent', render: (row) => `₹${row.total_spent}` },
    { key: 'is_active', header: 'Status', render: (row) => <Badge tone={row.is_active ? 'forest' : 'terracotta'}>{row.is_active ? 'Active' : 'Disabled'}</Badge> },
  ]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-serif text-forest-800">Customers</h1>
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
        exportFilename="customers.csv"
        rowActions={(row) => (
          <button className="text-sm text-forest-700 underline" onClick={() => setSelected(row)}>
            View
          </button>
        )}
      />

      <Drawer open={!!selected} title="Customer Details" onClose={() => setSelected(null)}>
        {selected && <CustomerDetail customer={selected} onClose={() => setSelected(null)} canManage={canManage} />}
      </Drawer>
    </div>
  )
}
